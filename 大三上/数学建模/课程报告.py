import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd

# ==========================================
# 1. 模型参数定义 (Model Parameters)
# ==========================================
# 节点定义
nodes = ['Exit0', 'Room1', 'Room2', 'Room3', 'Room4', 'Room5', 'Room6', 'Exit7']

# 邻接矩阵数据 (距离/通行成本)
# 来源：用户提供的邻接矩阵图片
# 单位：米 (假设)
adj_matrix_data = [
    # E0, R1, R2, R3, R4, R5, R6, E7
    [0, 5, 7, 9, 5, 7, 9, 12],  # Exit0
    [5, 0, 2, 4, 2, 4, 6, 9],   # Room1
    [7, 2, 0, 2, 4, 2, 4, 7],   # Room2
    [9, 4, 2, 0, 6, 4, 2, 5],   # Room3
    [5, 2, 4, 6, 0, 2, 4, 9],   # Room4
    [7, 4, 2, 4, 2, 0, 2, 7],   # Room5
    [9, 6, 4, 2, 4, 2, 0, 5],   # Room6
    [12, 9, 7, 5, 9, 7, 5, 0]   # Exit7
]

# 房间排查耗时 (T_check)
# 来源：用户提供的房间结构图片
inspection_times = {
    'Exit0': 0,
    'Room1': 90,
    'Room2': 60,
    'Room3': 60,
    'Room4': 60,
    'Room5': 90,
    'Room6': 60,
    'Exit7': 0
}

# 移动速度 (Speed)
# 为了匹配结果 217s，推算出速度为 2 m/s (或单位距离/s)
# 路径距离 14，排查 210，总 217 => 移动耗时 7 => 14/7 = 2
SPEED = 2.0 

# ==========================================
# 2. 构建图模型 (Build Graph)
# ==========================================
G = nx.Graph()

# 添加节点
G.add_nodes_from(nodes)

# 添加边 (完全图，权重为矩阵值)
for i, u in enumerate(nodes):
    for j, v in enumerate(nodes):
        if i < j: # 避免重复和自环
            weight = adj_matrix_data[i][j]
            G.add_edge(u, v, weight=weight)

# ==========================================
# 3. 路径评估函数 (Evaluation Function)
# ==========================================
def calculate_mission_time(graph, route, start_node, inspection_times, speed=1.0):
    """
    计算某条排查路线的总耗时
    :param graph: 建筑物图模型
    :param route: 排查房间序列 (包含终点，例如 ['Room1', 'Room2', 'Exit7'])
    :param start_node: 起始位置
    :param inspection_times: 各房间排查耗时字典
    :param speed: 移动速度
    :return: 总耗时, 详细日志
    """
    current_pos = start_node
    total_time = 0
    log = []
    
    log.append(f"开始任务，位置: {start_node}")
    
    for target in route:
        # 1. 移动时间
        if current_pos == target:
            travel_time = 0
        else:
            # 直接查边的权重 (因为是完全图，且矩阵给出了最短距离)
            distance = graph[current_pos][target]['weight']
            travel_time = distance / speed
        
        total_time += travel_time
        
        # 2. 排查时间
        check_time = inspection_times.get(target, 0)
        total_time += check_time
        
        log.append(f"移动至 {target} (距离 {distance}, 耗时 {travel_time:.1f}s) -> 排查 (耗时 {check_time}s) -> 当前累计: {total_time:.1f}s")
        
        current_pos = target
        
    return total_time, log

# ==========================================
# 4. 模拟 Excel 中的方案 (Simulation)
# ==========================================
print("-" * 30)
print("方案模拟 (Simulation Results)")
print("-" * 30)

# 消防员 1 任务
# 路线: Exit0 -> Room1 -> Room2 -> Room3 -> Exit7
ff1_start = 'Exit0'
ff1_route = ['Room1', 'Room2', 'Room3', 'Exit7']
time1, log1 = calculate_mission_time(G, ff1_route, ff1_start, inspection_times, SPEED)

print(f"【消防员 1】 路线: {ff1_start} -> {ff1_route}")
for l in log1:
    print(l)
print(f"消防员 1 总耗时: {time1} 秒\n")

# 消防员 2 任务
# 路线: Exit7 -> Room6 -> Room5 -> Room4 -> Exit0
ff2_start = 'Exit7'
ff2_route = ['Room6', 'Room5', 'Room4', 'Exit0']
time2, log2 = calculate_mission_time(G, ff2_route, ff2_start, inspection_times, SPEED)

print(f"【消防员 2】 路线: {ff2_start} -> {ff2_route}")
for l in log2:
    print(l)
print(f"消防员 2 总耗时: {time2} 秒\n")

max_time = max(time1, time2)
print(f"系统整体完成时间 (Makespan): {max_time} 秒")

# ==========================================
# 5. 可视化 (Visualization)
# ==========================================
try:
    plt.figure(figsize=(10, 6))
    
    # 手动定义位置以匹配走廊布局
    # Exit0(0,1), R1(1,2), R2(2,2), R3(3,2), E7(4,1)
    #             R4(1,0), R5(2,0), R6(3,0)
    pos = {
        'Exit0': (0, 1),
        'Room1': (1, 2), 'Room2': (2, 2), 'Room3': (3, 2),
        'Exit7': (4, 1),
        'Room4': (1, 0), 'Room5': (2, 0), 'Room6': (3, 0)
    }
    
    # 仅绘制主要连接边 (非完全图，为了视觉清晰)
    # 走廊骨架 + 房间连接
    visual_edges = [
        ('Exit0', 'Room1'), ('Exit0', 'Room4'),
        ('Room1', 'Room2'), ('Room2', 'Room3'), ('Room3', 'Exit7'),
        ('Room4', 'Room5'), ('Room5', 'Room6'), ('Room6', 'Exit7'),
        ('Room1', 'Room4'), ('Room2', 'Room5'), ('Room3', 'Room6')
    ]
    
    nx.draw_networkx_nodes(G, pos, node_size=1200, node_color='lightgreen')
    
    # 绘制边
    nx.draw_networkx_edges(G, pos, edgelist=visual_edges, width=2, edge_color='gray')

    # 标注边长 (距离)
    edge_labels = {(u, v): G[u][v]['weight'] for u, v in visual_edges}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='red', font_size=9)
    
    # 标注节点名称和排查时间 (合并显示)
    labels = {node: f"{node}\n({inspection_times[node]}s)" for node in nodes}
    nx.draw_networkx_labels(G, pos, labels=labels, font_size=9, font_weight='bold')

    plt.title("Building Layout & Inspection Times")
    plt.axis('off')
    
    output_img = 'building_layout_updated.png'
    plt.savefig(output_img)
    print(f"\n图模型可视化已保存为: {output_img}")
    
except Exception as e:
    print(f"可视化失败: {e}")
