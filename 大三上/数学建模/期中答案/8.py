# 定义两个用户掌握的技能集合
user1 = {'python', 'java', 'javascript', 'sql', 'html'}
user2 = {'python', 'c++', 'go', 'rust', 'javascript'}

# （1）重复数据检测：找出两个集合中共同存在的元素（交集）
duplicate_data = user1 & user2  # 等价于 user1.intersection(user2)

# （2）生成多个数据集的关系集合
# 交集：两个集合共有的元素（双方都掌握的技能）
intersection = user1 & user2

# 并集：两个集合的所有元素（双方掌握的全部技能，无重复）
union = user1 | user2  # 等价于 user1.union(user2)

# 差集1：user1有而user2没有的元素（user1独有的技能）
difference1 = user1 - user2  # 等价于 user1.difference(user2)

# 差集2：user2有而user1没有的元素（user2独有的技能）
difference2 = user2 - user1  # 等价于 user2.difference(user1)


# 输出结果
print("（1）两个集合中的重复数据：", duplicate_data)
print("（2）数据集关系分析：")
print("交集：", intersection)
print("并集：", union)
print("差集1，user1独有：", difference1)
print("差集2，user2独有：", difference2)