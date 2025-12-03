.text
main:
	ori t0,zero,8
	sw t0,0(zero)
	ori t0,zero,1
	sw t0,4(zero)
	ori t0,zero,5
	sw t0,8(zero)
	ori t0,zero,2
	sw t0,12(zero)
	ori t0,zero,7
	sw t0,16(zero)
	ori t0,zero,9
	sw t0,20(zero)
	ori t0,zero,6
	sw t0,24(zero)
	ori t0,zero,4
	sw t0,28(zero)
	ori t0,zero,3
	sw t0,32(zero)
	ori t0,zero,10
	sw t0,36(zero)	
	ori t0,zero,0
	add s0,zero,t0
	ori t0,zero,36
	add s1,zero,t0
sort_loop:
 	lw s3,0(s0)                     
	lw s4,0(s1)                	 
 	slt t0,s3,s4           #如果$s3<$s4，则置$t0=1；否则，置$t0=0
 	ori t1,zero,1
 	beq t0,t1,next   	  #如果$t0=1，则转next      
 	sw s3,0(s1)             #交换
	sw s4,0(s0)             
next:
        ori t0,zero,-4
	add s1,s1,t0                        
 	beq s0,s1,loop1                      
 	beq zero,zero,sort_loop       
loop1:
        ori t0,zero,4
  	add s0,s0,t0  
  	ori t0,zero,36                       
	add s1,zero,t0
 	beq s0,s1,end               #如果$s0=$s1，则转end
 	beq zero,zero,sort_loop       
end:
