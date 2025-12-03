#include "main.h"
#include "usart.h"
#include "gpio.h"
#include "stdio.h"

uint8_t Buff[2] = {0};
void SystemClock_Config(void);

int main(void)
{
  HAL_Init();            // HAL库初始化（初始化滴答定时器、中断优先级等）
  SystemClock_Config();         // 配置系统时钟（见下文解析）
  MX_GPIO_Init();           // GPIO初始化（配置控制引脚）
  MX_USART1_UART_Init();         // 串口1初始化（配置波特率、中断等）
  printf("\n\r FS-STM32开发板 继电器控制实验程序");
  printf("\n\r 请在串口软件输入框里输入“开”或者“关”, 然后按“发送”按钮");
  printf("\n\r 在发送完控制命令后可以听到继电器开启或者关闭的声音\n\r");

  while (1)
  {
		HAL_UART_Receive_IT(&huart1,Buff,2);		//启动串口1中断接收（每次接收2字节）
  }
}


void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct = { 0 };
    RCC_ClkInitTypeDef RCC_ClkInitStruct = { 0 };

    __HAL_RCC_PWR_CLK_ENABLE();// 使能PWR（电源控制）外设时钟
    __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);// 配置电压调节等级

    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;// 选择外部高速振荡器（HSE）
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;// 开启PLL（锁相环，用于倍频生成高频时钟）
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLM = 25;        // HSE分频因子
    RCC_OscInitStruct.PLL.PLLN = 336;       // PLL倍频因子
    RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2; // PLL输出分频
    RCC_OscInitStruct.PLL.PLLQ = 4;         // 用于USB等外设

    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK) {
        Error_Handler();
    }

    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK |
        RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;// 配置所有类型时钟
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV4;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV2;

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_5) != HAL_OK) {
        Error_Handler();
    }
}
int fputc(int ch, FILE *f)
{ 	
	while((USART1->SR&0X40)==0);	//循环发送, 直到发送完毕   
	USART1->DR = (uint8_t) ch; // 将字符写入发送数据寄存器（TDR），硬件自动发送
	return ch;// 返回写入的字符,ASCII码的形式
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
		if(Buff[0]==0xBF&&Buff[1]==0xAA)		//检测接收到的数据是不是“开”
		{
			HAL_GPIO_WritePin(GPIOG,GPIO_PIN_8,GPIO_PIN_SET);		//开启继电器
			printf("\n\r继电器 ：开\r\n");
		}
		else if(Buff[0]==0xB9&&Buff[1]==0xD8)	//检测接收到的数据是不是“关”
		{
			HAL_GPIO_WritePin(GPIOG,GPIO_PIN_8,GPIO_PIN_RESET);	//关闭继电器
			printf("\n\r继电器 ：关\r\n");
		}
}

void Error_Handler(void)
{
}

#ifdef  USE_FULL_ASSERT
void assert_failed(uint8_t *file, uint32_t line)
{ 
}
#endif
