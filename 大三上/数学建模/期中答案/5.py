def analyze_list(data):
    # （1）计算每个元素的出现频率
    frequency = {}
    for item in data:
        if item in frequency:
            frequency[item] += 1
        else:
            frequency[item] = 1
    
    # （2）移除重复元素，保持原有顺序
    seen = set() 
    unique_ordered = []  
    for item in data:
        if item not in seen:
            seen.add(item)  #标记为已出现
            unique_ordered.append(item)  #添加到结果列表
    
    return frequency, unique_ordered

data = [1, 2, 3, 2, 4, 3, 5, 1, 2, 3, 4, 5, 5, 1, 2, 3]

element_frequency, unique_list = analyze_list(data)

print("（1）每个元素的出现频率：", element_frequency)
print("（2）移除重复元素后的列表（保持原顺序）：", unique_list)