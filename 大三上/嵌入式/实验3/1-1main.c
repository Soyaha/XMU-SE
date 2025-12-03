#include "main.h"
#include "usart.h"
#include "gpio.h"
#include "zlg72128.h"
#include "stdio.h"
#include "i2c.h"

#define ZLG_READ_ADDRESS1         		0x01  	//键值寄存器
#define ZLG_READ_FUNCTION_ADDRESS 	0x03	//功能键寄存器
#define ZLG_READ_ADDRESS2         		0x10
#define ZLG_WRITE_ADDRESS1        		0x17	//数码管显示末尾地址
#define ZLG_WRITE_ADDRESS2        		0x16  
#define ZLG_WRITE_FLASH 	0x0B
#define ZLG_WRITE_SCANNUM 0x0D
#define BUFFER_SIZE1              		(countof(Tx1_Buffer))
#define BUFFER_SIZE2              		(countof(Rx2_Buffer))
#define countof(a) 				(sizeof(a) / sizeof(*(a)))

#define DE_A  		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_RESET) 
#define DE_B  		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_RESET)
#define DE_C    		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_RESET) 
#define DE_D      		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_SET)
#define DE_AB  		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_RESET) 
#define DE_BC  		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_RESET)
#define DE_CD    		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_SET) 
#define DE_DA     		HAL_GPIO_WritePin(GPIOD, GPIO_PIN_12,GPIO_PIN_SET);HAL_GPIO_WritePin(GPIOH, GPIO_PIN_13,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_4,GPIO_PIN_RESET);HAL_GPIO_WritePin(GPIOE, GPIO_PIN_6,GPIO_PIN_SET)

uint8_t flag;				//不同的按键有不同的标志位值
uint8_t flag_key = 0;//中断标志位，每次按键产生一次中断，并开始读取8个数码管的值
uint8_t Rx2_Buffer[8]={0};
uint8_t Tx1_Buffer[8]={0};
uint8_t clear[9] = { 0 };
uint8_t Rx1_Buffer[1]={0};
uint8_t Rx1_Buffer_P[1]={0};
uint8_t Rx1_Buffer_T[1]={0};
uint8_t reset[1]={0xff};
uint8_t Transmit_Buffer[2]={0x00,0x03};

void delay_my(uint8_t time);
void SystemClock_Config(void);
void swtich_key(void);
void swtich_key_func(void);
void switch_flag(void);

int main(void)
{
  	HAL_Init();		//HAL初始化
  	SystemClock_Config();	//系统时钟配置
  	MX_GPIO_Init();		//GPIO初始化
  	MX_I2C1_Init();		//I2C初始化
  	MX_USART1_UART_Init();	//串口初始化

	printf("\n\r FS-STM32开发板小键盘控制步进电机测试实验\r\n");		//在串口调试助手上显示打印的内容

 
  	while (1)
  	{
		I2C_ZLG72128_Read(&hi2c1, Ox61, 0x01, Rx1_Buffer_P, 1);//读普通按键值
		I2C_ZLG72128_Read(&hi2c1, Ox61, 0x03, Rx1_Bufer_T, 1);//读功能按键值
		if (Rx1_Buffer_P[O] != OxO)//普通按键（12个）
			swtich_key();//键值转换
		if (Rx1_Buffer_T[O] != Oxff)		//功能按键（4个）
			swtich_key_func();//键值转换
		if(flag == 1)	//如果有按键
		{
			//*****八拍方式******   顺时针转      A  AB  B  BC  C  CD  D  DA     
			DE_A;
			HAL_Delay(1);		//可进行调速，延时时间不能太短     3（最慢）、2（中等）、1（最快）

			DE_AB;
			HAL_Delay(1);

			DE_B;
			HAL_Delay(1);

			DE_BC;
			HAL_Delay(1);

			DE_C;
			HAL_Delay(1);

			DE_CD;
			HAL_Delay(1);

			DE_D;
			HAL_Delay(1);

			DE_DA;
			HAL_Delay(1);
		}
		if (flag == 2) {
			//*****八拍方式******   逆时针转      DA  D  CD  C  BC  B  AB  A     
			DE_DA;
			HAL_Delay(3);		//可进行调速，延时时间不能太短     3（最慢）、2（中等）、1（最快）

			DE_D;
			HAL_Delay(3);

			DE_CD;
			HAL_Delay(3);

			DE_C;
			HAL_Delay(3);

			DE_BC;
			HAL_Delay(3);

			DE_B;
			HAL_Delay(3);

			DE_AB;
			HAL_Delay(3);

			DE_A;
			HAL_Delay(3);
		}
	
	  	HAL_Delay(100);	//延时100ms
  	}
}

void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  RCC_OscInitStruct.PLL.PLLM = 25;
  RCC_OscInitStruct.PLL.PLLN = 336;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
  RCC_OscInitStruct.PLL.PLLQ = 4;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK|RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV4;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV2;
  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_5) != HAL_OK)
  {
    Error_Handler();
  }
}

void swtich_key(void)		//普通按键值转换（12个键）————0、4、5、6、7、8、9、11、12、13、14、15
{
	switch(Rx1_Buffer_P[0])
	{
		case 0x01:
			flag = 13;					
			break;
		case 0x02:	
			flag = 15;
			break;
		case 0x03:	
			flag = 0;
			break;
		case 0x04:
			flag = 14;
			break;   
		case 0x09:
			flag = 12;
			break;
		case 0x0a:
			flag = 9;
			break;
		case 0x0b:
			flag = 8;
			break;
		case 0x0c:
			flag = 7;
			break;
		case 0x11:
			flag = 11;
			break;
		case 0x12:
			flag = 6;
			break;
		case 0x13:
			flag = 5;
			break;
		case 0x14:
			flag = 4;
			break;
		default:
			break;
	}
}

void swtich_key_func(void)		//功能按键值转换（4个）————1、2、3、10
{
	switch (Rx1_Buffer_T[0])
	{
		case 0xfe:
			flag = 10;
			break;
		case 0xfd:
			flag = 3;
			break;
		case 0xfb:
			flag = 2;
			break;
		case 0xf7:
			flag = 1;
			break;
		default:
			break;
	}
}

int fputc(int ch, FILE *f)		//用于在串口调试助手上显示字符
{ 
  	uint8_t tmp[1]={0};
	tmp[0] = (uint8_t)ch;
	HAL_UART_Transmit(&huart1,tmp,1,10);	
	return ch;
}

void Error_Handler(void)
{
}

#ifdef  USE_FULL_ASSERT
void assert_failed(uint8_t *file, uint32_t line)
{ 
}
#endif
