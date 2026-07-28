import json
import os

import matplotlib.pyplot as plt
import pandas as pd


BASELINE_HISTORY = os.path.join("results", "baseline", "baseline_history.csv")
IMPROVED_HISTORY = os.path.join("results", "improved", "improved_history.csv")
BASELINE_METRICS = os.path.join("results", "baseline", "baseline_test_metrics.json")
IMPROVED_METRICS = os.path.join("results", "improved", "improved_test_metrics.json")
OUTPUT_DIR = os.path.join("results", "compare")


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    missing_files = [
        path
        for path in [BASELINE_HISTORY, IMPROVED_HISTORY, BASELINE_METRICS, IMPROVED_METRICS]
        if not os.path.exists(path)
    ]
    if missing_files:
        print("缺少以下结果文件，无法绘图：")
        for path in missing_files:
            print(f"- {path}")
        print("请先分别运行基准脚本和改进脚本生成日志与测试结果。")
        return

    baseline_history = pd.read_csv(BASELINE_HISTORY)
    improved_history = pd.read_csv(IMPROVED_HISTORY)
    baseline_metrics = load_json(BASELINE_METRICS)
    improved_metrics = load_json(IMPROVED_METRICS)

    compare_df = pd.DataFrame(
        [
            {
                "model": "baseline",
                "accuracy": baseline_metrics["accuracy"],
                "macro_f1": baseline_metrics["macro_f1"],
                "weighted_f1": baseline_metrics["weighted_f1"],
            },
            {
                "model": "improved",
                "accuracy": improved_metrics["accuracy"],
                "macro_f1": improved_metrics["macro_f1"],
                "weighted_f1": improved_metrics["weighted_f1"],
            },
        ]
    )
    compare_df.to_csv(os.path.join(OUTPUT_DIR, "comparison_summary.csv"), index=False)

    plt.style.use("seaborn-v0_8-whitegrid")
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].plot(baseline_history["epoch"], baseline_history["val_acc"], marker="o", label="Baseline Val Acc")
    axes[0].plot(improved_history["epoch"], improved_history["val_acc"], marker="o", label="Improved Val Acc")
    axes[0].set_title("Validation Accuracy")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].legend()

    axes[1].plot(baseline_history["epoch"], baseline_history["val_macro_f1"], marker="o", label="Baseline Val Macro F1")
    axes[1].plot(improved_history["epoch"], improved_history["val_macro_f1"], marker="o", label="Improved Val Macro F1")
    axes[1].set_title("Validation Macro F1")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Macro F1")
    axes[1].legend()

    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "validation_curve_compare.png"), dpi=200, bbox_inches="tight")
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 5))
    metric_names = ["accuracy", "macro_f1", "weighted_f1"]
    x = range(len(metric_names))
    width = 0.35

    baseline_values = [baseline_metrics[name] for name in metric_names]
    improved_values = [improved_metrics[name] for name in metric_names]

    ax.bar([i - width / 2 for i in x], baseline_values, width=width, label="Baseline")
    ax.bar([i + width / 2 for i in x], improved_values, width=width, label="Improved")
    ax.set_xticks(list(x))
    ax.set_xticklabels(["Accuracy", "Macro F1", "Weighted F1"])
    ax.set_ylim(0, 1)
    ax.set_title("Test Metric Comparison")
    ax.legend()

    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "test_metric_compare.png"), dpi=200, bbox_inches="tight")
    plt.close(fig)

    print("对比图已保存到 results/compare/ 下。")
    print(compare_df)


if __name__ == "__main__":
    main()