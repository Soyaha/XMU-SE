# 定义列表（避免使用list作为变量名，因list是Python内置类型）
nums = [3, 5, 4, 7, 5, 9, 7, 6, 2, 3, 5, 8]

# 步骤1：找到列表中的最大值和最小值（两者的绝对差为最大）
max_val = max(nums)
min_val = min(nums)

# 步骤2：计算最大绝对差
max_abs_diff = abs(max_val - min_val)

# 步骤3：获取最大值和最小值在列表中的索引（index()返回第一个出现的索引）
max_index = nums.index(max_val)
min_index = nums.index(min_val)

# 输出结果
print(f"两个元素的最大绝对差为：{max_abs_diff}")
print(f"对应的元素及索引：{max_val}（索引{max_index}）和{min_val}（索引{min_index}）")