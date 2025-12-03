.data
array: .word 8,1,5,2,7,9,6,4,3,10
.text
main:
    li $s0, 9       # 外层循环次数 n-1 = 9
outer_loop:
    li $s1, 0       # 内层循环索引 j = 0
inner_loop:
    sll $t0, $s1, 2  # 计算地址偏移 j*4
    lw $t1, array($t0)  # 加载 array[j]
    addi $t2, $s1, 1    # j + 1
    sll $t3, $t2, 2    # 计算地址偏移 (j+1)*4
    lw $t4, array($t3)  # 加载 array[j+1]
    slt $t5, $t4, $t1  # 比较 array[j+1] < array[j]
    beq $t5, $zero, no_swap  # 若不小于，不交换
    # 交换 array[j] 和 array[j+1]
    sw $t4, array($t0)
    sw $t1, array($t3)
no_swap:
    addi $s1, $s1, 1    # j++
    slt $t6, $s1, $s0    # 检查 j < $s0
    beq $t6, $zero, inner_loop_end
    j inner_loop
inner_loop_end:
    addi $s0, $s0, -1   # 外层循环次数减1
    slt $t7, $zero, $s0  # 检查外层循环是否继续
    beq $t7, $zero, outer_loop_end
    j outer_loop
outer_loop_end:
    li $v0, 10          # 程序退出
    syscall