import time


def read_text_file(file_path):
    """读取文本文件内容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()


def write_text_file(file_path, text):
    """写入文本文件"""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)


def lz77_encode(text, window_size=255):
    """LZ77 编码函数"""
    encoded = []
    i = 0
    n = len(text)
    while i < n:
        max_len = 0
        off = 0
        c = text[i]
        start = max(0, i - window_size)
        for j in range(start, i):
            len_match = 0
            while i + len_match < n and j + len_match < i and text[j + len_match] == text[i + len_match]:
                len_match += 1
            if len_match > max_len:
                max_len = len_match
                off = i - j
        if max_len > 0:
            i += max_len
            c = text[i] if i < n else '\0'
            encoded.append((off, max_len, c))
        else:
            encoded.append((0, 0, text[i]))
        i += 1
    with open('encoded.bin', 'wb') as f:
        for triple in encoded:
            off_bytes = triple[0].to_bytes(1, 'big')
            len_bytes = triple[1].to_bytes(1, 'big')
            c_bytes = triple[2].encode('utf-8') if triple[2] != '\0' else b'\0'
            f.write(off_bytes + len_bytes + c_bytes)
    return encoded


def lz77_decode(encoded_file):
    """LZ77 解码函数"""
    decoded = []
    with open(encoded_file, 'rb') as f:
        while True:
            off_bytes = f.read(1)
            if not off_bytes:
                break
            off = int.from_bytes(off_bytes, 'big')
            len_val = int.from_bytes(f.read(1), 'big')
            c = f.read(1).decode('utf-8', errors='ignore')
            if len_val > 0:
                start = len(decoded) - off
                decoded.extend(decoded[start:start + len_val])
            if c != '\0':
                decoded.append(c)
    return ''.join(decoded)


if __name__ == "__main__":
    input_file = 'C:\\Users\\amun\\Desktop\\多媒体技术\\实验\\large.txt'
    output_decode_file = 'C:\\Users\\amun\\Desktop\\多媒体技术\\实验\\output.txt'

    # 读取输入文本
    input_text = read_text_file(input_file)

    # 编码并统计时间
    start_encode = time.time()
    lz77_encode(input_text)
    end_encode = time.time()
    encode_time = end_encode - start_encode

    # 解码并统计时间
    start_decode = time.time()
    decoded_text = lz77_decode('encoded.bin')
    end_decode = time.time()
    decode_time = end_decode - start_decode

    # 保存解码后的文本
    write_text_file(output_decode_file, decoded_text)

    # 输出时间
    print(f"LZ77 编码时间: {encode_time:.6f} 秒")
    print(f"LZ77 解码时间: {decode_time:.6f} 秒")