# 定义原始字符串
message = "abcdefghijklmnopqrstuvwxyz"

# （1）获取所有奇数位置的字符（索引1,3,5...）
# 切片规则：从索引1开始，步长为2（每次跳过1个字符）
odd_chars = message[1::2]

# （2）获取所有偶数位置的字符（索引0,2,4...）
# 切片规则：从索引0开始，步长为2（每次跳过1个字符）
even_chars = message[::2]

# （3）每隔3个字符取一个
# 切片规则：从索引0开始，步长为3（每次跳过2个字符）
every_3_chars = message[::3]

# （4）从后往前每隔2个字符取一个
# 切片规则：从末尾开始，步长为-2（每次向前跳过1个字符）
reverse_every_2_chars = message[::-2]

# 输出结果
print("（1）奇数位置的字符：", odd_chars)
print("（2）偶数位置的字符：", even_chars)
print("（3）每隔3个字符取一个：", every_3_chars)
print("（4）从后往前每隔2个字符取一个：", reverse_every_2_chars)