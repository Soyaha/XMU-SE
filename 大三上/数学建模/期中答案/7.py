# （1）将列表转换为元组
my_list = [5, 2, 8, 1, 9, 3]
list_to_tuple = tuple(my_list)  # 使用tuple()函数转换

# （2）将元组转换为列表（注意：原元组定义应为()，此处修正格式）
my_tuple = (1, 5, 2, 8, 6)  # 元组正确格式为圆括号
tuple_to_list = list(my_tuple)  # 使用list()函数转换

# （3）合并两个元组
tuple1 = (1, 3, 5)
tuple2 = (2, 4, 6)
merged_tuple = tuple1 + tuple2  # 元组支持+运算，生成新元组

# （4）查找元组中最大和最小元素的索引
tuple3 = (15, 22, 18, 12, 29, 23)
max_val = max(tuple3)  # 获取最大值
min_val = min(tuple3)  # 获取最小值
max_index = tuple3.index(max_val)  # 最大值的索引
min_index = tuple3.index(min_val)  # 最小值的索引


# 输出结果
print("（1）列表转元组：", list_to_tuple)
print("（2）元组转列表：", tuple_to_list)
print("（3）合并后的元组：", merged_tuple)
print(f"（4）元组中最大值{max_val}的索引为{max_index}，最小值{min_val}的索引为{min_index}")