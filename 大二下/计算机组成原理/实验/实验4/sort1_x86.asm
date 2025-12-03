.486
.model flat, stdcall
option casemap: none 
include \masm32\include\msvcrt.inc
include \masm32\include\kernel32.inc
includelib \masm32\lib\msvcrt.lib
includelib \masm32\lib\kernel32.lib
include \masm32\include\windows.inc
include \masm32\include\masm32.inc
include \masm32\include\kernel32.inc
include \masm32\macros\macros.asm
includelib \masm32\lib\masm32.lib
includelib \masm32\lib\kernel32.lib

.DATA
           szOut1 db '%d ',0
           szOut2 db '从大到小：',0
           DATA1  DW 8,1,5,2,7,9,6,4,3,10,'$'


.CODE

      START:
		    MOV ECX,10
            DEC ECX

      LOOP2:
	;存储cx到dx
              MOV       EDX,ECX
              SHL       EDX,1
              MOV       ESI,0
      LOOP1:
              MOV       AX,DATA1[ESI]
              CMP       AX,DATA1[ESI+2]
              JA        NEXT
	;bx相当于是中间变量,交换
              MOV       BX,AX
              MOV       AX,DATA1[ESI+2]
              MOV       DATA1[ESI+2],BX
              MOV       DATA1[ESI],AX
       NEXT:
              ADD       ESI,2
              CMP       ESI,EDX
              JNZ       LOOP1

              LOOP      LOOP2
            
            invoke crt_printf,addr szOut2
 		    MOV SI,9     				
     		MOV BP,0             ;数据打印
			LEA EBX,DATA1
PRINT:		
            MOV AX,[EBX]
            invoke crt_printf,addr szOut1,AX
	        INC BP
			ADD EBX,2
			CMP BP,SI
			JLE PRINT
END START