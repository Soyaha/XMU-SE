#include "gpio.h"

void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOG_CLK_ENABLE();

  HAL_GPIO_WritePin(GPIOG, GPIO_PIN_8, GPIO_PIN_RESET);

  GPIO_InitStruct.Pin = GPIO_PIN_8;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;

  HAL_GPIO_Init(GPIOG, &GPIO_InitStruct);
}

void MX_GPIO_Init(void)
{
	GPIO_InitTypeDef GPIO_InitStruct = { 0 };
	// 1. 使能GPIOG时钟（必需步骤，STM32外设时钟默认关闭）
	__HAL_RCC_GPIOA_CLK_ENABLE(); ）
	__HAL_RCC_GPIOH_CLK_ENABLE();  
	__HAL_RCC_GPIOG_CLK_ENABLE();  // 使能GPIOG时钟

	// 2. 初始化前设置PG8初始电平为低电平（避免继电器误动作）
	HAL_GPIO_WritePin(GPIOG, GPIO_PIN_8, GPIO_PIN_RESET);

	// 3. 配置PG8为推挽输出模式
	GPIO_InitStruct.Pin = GPIO_PIN_8;                  // 选择PG8引脚
	GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;        // 推挽输出（强驱动）
	GPIO_InitStruct.Pull = GPIO_NOPULL;                // 无上/下拉（外部电路已设计）
	GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;       // 低速输出（继电器无需高速切换）

	HAL_GPIO_Init(GPIOG, &GPIO_InitStruct);            // 应用配置到GPIOG
}