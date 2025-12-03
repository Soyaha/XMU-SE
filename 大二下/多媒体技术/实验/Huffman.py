import heapq
from collections import Counter, namedtuple

# 定义霍夫曼树节点
class Node(namedtuple('Node', ['left', 'right'])):
    def walk(self, code, acc):
        self.left.walk(code, acc + '0')
        self.right.walk(code, acc + '1')

class Leaf(namedtuple('Leaf', ['char'])):
    def walk(self, code, acc):
        code[self.char] = acc or '0'

def huffman_encode(s):
    h = []
    for char, freq in Counter(s).items():
        h.append((freq, len(h), Leaf(char)))
    heapq.heapify(h)
    count = len(h)
    while len(h) > 1:
        freq1, _count1, left = heapq.heappop(h)
        freq2, _count2, right = heapq.heappop(h)
        heapq.heappush(h, (freq1 + freq2, count, Node(left, right)))
        count += 1
    code = {}
    if h:
        [(_freq, _count, root)] = h
        root.walk(code, '')
    return code

def compress_to_result(input_file):
    """压缩文件并强制输出到result.txt"""
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
    code = huffman_encode(text)
    encoded = ''.join(code[char] for char in text)
    
    # 写入result.txt，使用utf-8确保兼容特殊字符
    with open('result.txt', 'w', encoding='utf-8') as f:
        f.write(encoded)
    
    print(f"压缩完成，结果已保存到result.txt（压缩率：{len(encoded)/len(text):.2%}）")
    return encoded

# 直接调用，自动生成result.txt
compress_to_result('C:\\Users\\amun\\Desktop\\多媒体技术\\实验\\text file\\alphaonce.txt')  # 替换为你的输入文件名