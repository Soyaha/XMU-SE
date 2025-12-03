# 定义原始列表
numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
numbers2 = [5, 15, 7, 13, 9, 10, 3, 12, 4, 1]

# 合并列表
combined = numbers1 + numbers2

# 去除重复元素
unique_numbers = list(set(combined))

# 按从大到小排序
sorted_numbers = sorted(unique_numbers, reverse=True)

print("合并、去重并按从大到小排序后的列表：", sorted_numbers)