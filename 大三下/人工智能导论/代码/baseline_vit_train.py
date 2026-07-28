import json
import os
import random

import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from PIL import Image
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from transformers import ViTForImageClassification, ViTImageProcessor


def set_seed(seed: int = 42) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


def choose_existing_path(candidates):
    for path in candidates:
        if path and os.path.exists(path):
            return path
    return candidates[-1]


def get_dataset_root() -> str:
    candidates = [
        os.environ.get("HAM10000_ROOT"),
        r"/kaggle/input/skin-cancer-mnist-ham10000",
        r"/kaggle/input/datasets/kmader/skin-cancer-mnist-ham10000",
        r"D:\kaggle\input\skin-cancer-mnist-ham10000",
        r"D:\kaggle\input\datasets\kmader\skin-cancer-mnist-ham10000",
    ]
    return choose_existing_path(candidates)


def get_model_dir() -> str:
    candidates = [
        os.environ.get("VIT_MODEL_DIR"),
        os.path.join("gogle_vit_modle", "vit-base-patch16-224-in21k"),
        r"/kaggle/input/vit-base-patch16-224-in21k/vit-base-patch16-224-in21k",
        r"/kaggle/input/models/soyaha/vit-base-patch16-224-in21k/transformers/default/1/vit-base-patch16-224-in21k",
    ]
    return choose_existing_path(candidates)


def build_dataframe(dataset_root: str) -> pd.DataFrame:
    part1_dir = os.path.join(dataset_root, "HAM10000_images_part_1")
    part2_dir = os.path.join(dataset_root, "HAM10000_images_part_2")
    csv_path = os.path.join(dataset_root, "HAM10000_metadata.csv")

    df = pd.read_csv(csv_path)
    label_map = {"nv": 0, "mel": 1, "bkl": 2, "bcc": 3, "akiec": 4, "vasc": 5, "df": 6}

    def get_image_path(image_id: str):
        first_path = os.path.join(part1_dir, image_id + ".jpg")
        if os.path.exists(first_path):
            return first_path
        second_path = os.path.join(part2_dir, image_id + ".jpg")
        return second_path if os.path.exists(second_path) else None

    df = df.copy()
    df["image_path"] = df["image_id"].apply(get_image_path)
    df["label"] = df["dx"].map(label_map)
    df = df.dropna(subset=["image_path", "label"]).reset_index(drop=True)
    df["label"] = df["label"].astype(int)
    return df


def export_data_tables(df: pd.DataFrame, train_df: pd.DataFrame, val_df: pd.DataFrame, test_df: pd.DataFrame) -> None:
    raw_dir = os.path.join("data", "raw")
    intermediate_dir = os.path.join("data", "intermediate")
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(intermediate_dir, exist_ok=True)

    raw_manifest = df[["image_id", "dx", "image_path", "label"]].copy()
    raw_manifest.to_csv(os.path.join(raw_dir, "raw_manifest.csv"), index=False)
    train_df.to_csv(os.path.join(intermediate_dir, "baseline_train_split.csv"), index=False)
    val_df.to_csv(os.path.join(intermediate_dir, "baseline_val_split.csv"), index=False)
    test_df.to_csv(os.path.join(intermediate_dir, "baseline_test_split.csv"), index=False)


class SkinDataset(Dataset):
    def __init__(self, df: pd.DataFrame, transform=None):
        self.df = df.reset_index(drop=True)
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        image = Image.open(row["image_path"]).convert("RGB")
        label = int(row["label"])
        if self.transform is not None:
            image = self.transform(image)
        return image, label


def evaluate(model, data_loader, device):
    model.eval()
    all_preds = []
    all_labels = []
    with torch.no_grad():
        for images, labels in data_loader:
            images = images.to(device)
            logits = model(images).logits
            preds = torch.argmax(logits, dim=1).cpu().numpy()
            all_preds.extend(preds)
            all_labels.extend(labels.numpy())

    accuracy = accuracy_score(all_labels, all_preds)
    macro_f1 = f1_score(all_labels, all_preds, average="macro")
    weighted_f1 = f1_score(all_labels, all_preds, average="weighted")
    return accuracy, macro_f1, weighted_f1, all_labels, all_preds


def label_smoothing_loss(logits, targets, smoothing: float = 0.05):
    log_probs = F.log_softmax(logits, dim=1)
    num_classes = logits.size(1)
    with torch.no_grad():
        target_distribution = torch.zeros_like(log_probs)
        target_distribution.fill_(smoothing / (num_classes - 1))
        target_distribution.scatter_(1, targets.unsqueeze(1), 1.0 - smoothing)
    return torch.mean(torch.sum(-target_distribution * log_probs, dim=1))


def main():
    set_seed(42)

    dataset_root = get_dataset_root()
    model_dir = get_model_dir()
    output_dir = os.path.join("results", "baseline")
    os.makedirs(output_dir, exist_ok=True)

    print("正在加载数据...")
    df = build_dataframe(dataset_root)
    label_map = {"nv": 0, "mel": 1, "bkl": 2, "bcc": 3, "akiec": 4, "vasc": 5, "df": 6}

    train_df, temp_df = train_test_split(
        df,
        test_size=0.2,
        random_state=42,
        stratify=df["label"],
    )
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        random_state=42,
        stratify=temp_df["label"],
    )
    export_data_tables(df, train_df, val_df, test_df)

    print(f"数据加载完成，共 {len(df)} 条，训练/验证/测试 = {len(train_df)}/{len(val_df)}/{len(test_df)}")

    processor = ViTImageProcessor.from_pretrained(model_dir)
    train_transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(10),
            transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.05, hue=0.01),
            transforms.ToTensor(),
            transforms.Normalize(mean=processor.image_mean, std=processor.image_std),
        ]
    )
    eval_transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=processor.image_mean, std=processor.image_std),
        ]
    )

    train_loader = DataLoader(SkinDataset(train_df, train_transform), batch_size=32, shuffle=True, num_workers=0)
    val_loader = DataLoader(SkinDataset(val_df, eval_transform), batch_size=32, shuffle=False, num_workers=0)
    test_loader = DataLoader(SkinDataset(test_df, eval_transform), batch_size=32, shuffle=False, num_workers=0)

    print("正在加载基准 ViT 模型...")
    model = ViTForImageClassification.from_pretrained(
        model_dir,
        num_labels=7,
        ignore_mismatched_sizes=True,
    )
    model.config.hidden_dropout_prob = 0.15
    model.config.attention_probs_dropout_prob = 0.15

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"模型设备: {device}")

    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5, weight_decay=0.01)
    epochs = 20
    best_val_macro_f1 = 0.0
    patience = 4
    no_improve = 0
    history = []
    best_model_path = os.path.join(output_dir, "best_baseline_model.pth")

    total_steps = max(len(train_loader) * epochs, 1)
    warmup_steps = max(int(0.1 * total_steps), 1)

    def lr_lambda(current_step: int):
        if current_step < warmup_steps:
            return float(current_step + 1) / float(warmup_steps)
        progress = float(current_step - warmup_steps) / float(max(total_steps - warmup_steps, 1))
        return max(0.0, 1.0 - progress)

    scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda)

    print("开始训练基准模型...")
    global_step = 0
    for epoch in range(epochs):
        model.train()
        train_loss_sum = 0.0
        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            logits = model(images).logits
            loss = label_smoothing_loss(logits, labels, smoothing=0.05)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            scheduler.step()
            train_loss_sum += loss.item()
            global_step += 1

        avg_train_loss = train_loss_sum / max(len(train_loader), 1)
        val_acc, val_macro_f1, val_weighted_f1, _, _ = evaluate(model, val_loader, device)

        history.append(
            {
                "epoch": epoch + 1,
                "train_loss": avg_train_loss,
                "val_acc": val_acc,
                "val_macro_f1": val_macro_f1,
                "val_weighted_f1": val_weighted_f1,
            }
        )

        print(f"Epoch [{epoch + 1}/{epochs}] -> Loss: {avg_train_loss:.4f} | Val Acc: {val_acc:.4f} | Val F1: {val_macro_f1:.4f}")

        if val_macro_f1 > best_val_macro_f1:
            best_val_macro_f1 = val_macro_f1
            no_improve = 0
            torch.save(model.state_dict(), best_model_path)
            print(f"  -> 保存最佳基准模型 (Val Macro F1: {best_val_macro_f1:.4f})")
        else:
            no_improve += 1
            if no_improve >= patience:
                print(f"  -> 触发早停，连续 {patience} 轮未提升")
                break

    history_df = pd.DataFrame(history)
    history_df.to_csv(os.path.join(output_dir, "baseline_history.csv"), index=False)

    print("正在加载最佳基准模型进行测试...")
    model.load_state_dict(torch.load(best_model_path, map_location=device))
    test_acc, test_macro_f1, test_weighted_f1, test_truth, test_preds = evaluate(model, test_loader, device)

    report = classification_report(test_truth, test_preds, target_names=list(label_map.keys()), digits=4)
    metrics = {
        "accuracy": test_acc,
        "macro_f1": test_macro_f1,
        "weighted_f1": test_weighted_f1,
        "best_val_macro_f1": best_val_macro_f1,
        "epochs_ran": len(history),
    }
    with open(os.path.join(output_dir, "baseline_test_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)
    with open(os.path.join(output_dir, "baseline_classification_report.txt"), "w", encoding="utf-8") as f:
        f.write(report)

    print("\n==============================")
    print("基准模型测试结果")
    print("==============================")
    print(f"Accuracy: {test_acc:.4f}")
    print(f"Macro F1: {test_macro_f1:.4f}")
    print(f"Weighted F1: {test_weighted_f1:.4f}")
    print("\n分类报告:\n")
    print(report)


if __name__ == "__main__":
    main()