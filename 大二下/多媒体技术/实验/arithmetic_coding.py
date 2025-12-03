import struct


class ArithmeticEncoder:
    def __init__(self, text):
        self.text = text
        self.frequencies = self.calculate_frequencies()
        self.cumulative_frequencies = self.calculate_cumulative_frequencies()

    def calculate_frequencies(self):
        frequencies = {}
        for char in self.text:
            if char in frequencies:
                frequencies[char] += 1
            else:
                frequencies[char] = 1
        total = len(self.text)
        for char in frequencies:
            frequencies[char] /= total
        return frequencies

    def calculate_cumulative_frequencies(self):
        cumulative_frequencies = {}
        cumulative = 0.0
        for char in sorted(self.frequencies):
            cumulative_frequencies[char] = cumulative
            cumulative += self.frequencies[char]
        return cumulative_frequencies

    def encode(self):
        low, high = 0.0, 1.0
        for char in self.text:
            range_width = high - low
            high = low + range_width * (self.cumulative_frequencies[char] + self.frequencies[char])
            low = low + range_width * self.cumulative_frequencies[char]
        return (low + high) / 2

    def decode(self, encoded_value, text_length):
        low, high = 0.0, 1.0
        decoded_text = ""
        for _ in range(text_length):
            range_width = high - low
            value = (encoded_value - low) / range_width
            for char in sorted(self.cumulative_frequencies):
                if self.cumulative_frequencies[char] <= value < self.cumulative_frequencies[char] + self.frequencies[char]:
                    decoded_text += char
                    high = low + range_width * (self.cumulative_frequencies[char] + self.frequencies[char])
                    low = low + range_width * self.cumulative_frequencies[char]
                    break
        return decoded_text

    def float_to_binary(self, value, precision):
        [d] = struct.unpack(">Q", struct.pack(">d", value))
        binary = f"{d:064b}"
        return binary[:precision]

    def binary_to_float(self, binary):
        h = int(binary, 2)
        return struct.unpack(">d", struct.pack(">Q", h))[0]


def read_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"错误：未找到文件 {file_path}。")
        return None
    except Exception as e:
        print(f"读取文件时发生错误：{e}。")
        return None


def write_file(file_path, content):
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
    except Exception as e:
        print(f"写入文件时发生错误：{e}。")


def main():
    input_file_path = "C:\\Users\\amun\\Desktop\\多媒体技术\\实验\\input.txt"
    encoded_output_path = "C:\\Users\\amun\\Desktop\\多媒体技术\\实验\\output.txt"
    input_text = read_file(input_file_path)
    if input_text is None:
        return
    encoder = ArithmeticEncoder(input_text)
    encoded_value = encoder.encode()
    # 直接设置为64位，确保浮点数转换无精度损失
    precision = 64
    encoded_binary = encoder.float_to_binary(encoded_value, precision)
    decoded_value = encoder.binary_to_float(encoded_binary)
    decoded_text = encoder.decode(decoded_value, len(input_text))

    print(f"原始文本: {input_text}")
    print(f"编码值: {encoded_value}")
    print(f"编码二进制: {encoded_binary}")
    print(f"解码文本: {decoded_text}")

    if decoded_text == input_text:
        print("解码验证成功，编码前后内容一致。")
    else:
        print("解码验证失败，编码前后内容不一致。")

    write_file(encoded_output_path, encoded_binary)


if __name__ == "__main__":
    main()