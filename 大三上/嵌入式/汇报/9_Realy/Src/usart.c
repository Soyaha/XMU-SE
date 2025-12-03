#include "usart.h"

UART_HandleTypeDef huart1;

void MX_USART1_UART_Init(void)
{
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    Error_Handler();
  }
}

void HAL_UART_MspInit(UART_HandleTypeDef* uartHandle)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  if(uartHandle->Instance==USART1)
  {
    __HAL_RCC_USART1_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    GPIO_InitStruct.Pin = GPIO_PIN_10|GPIO_PIN_9;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF7_USART1;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    HAL_NVIC_SetPriority(USART1_IRQn, 0, 0);
    HAL_NVIC_EnableIRQ(USART1_IRQn);
  }
}

void HAL_UART_MspDeInit(UART_HandleTypeDef* uartHandle)
{
  if(uartHandle->Instance==USART1)
  {
    __HAL_RCC_USART1_CLK_DISABLE();
    HAL_GPIO_DeInit(GPIOA, GPIO_PIN_10|GPIO_PIN_9);
    HAL_NVIC_DisableIRQ(USART1_IRQn);
  }
} 
void MX_USART1_UART_Init(void)
{
    huart1.Instance = USART1;                          // 选择USART1外设
    huart1.Init.BaudRate = 115200;                     // 波特率115200bps
    huart1.Init.WordLength = UART_WORDLENGTH_8B;      // 8位数据位
    huart1.Init.StopBits = UART_STOPBITS_1;            // 1位停止位
    huart1.Init.Parity = UART_PARITY_NONE;            // 无校验位
    huart1.Init.Mode = UART_MODE_TX_RX;               // 同时支持发送和接收
    huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;      // 无硬件流控
    huart1.Init.OverSampling = UART_OVERSAMPLING_16;  // 16倍过采样（提升数据准确性）
    if (HAL_UART_Init(&huart1) != HAL_OK)            // 初始化USART1
    {
        Error_Handler();
    }
}

// 底层硬件初始化（串口引脚与中断配置）
void HAL_UART_MspInit(UART_HandleTypeDef* uartHandle)
{
    GPIO_InitTypeDef GPIO_InitStruct = { 0 };
    if (uartHandle->Instance == USART1)
    {
        __HAL_RCC_USART1_CLK_ENABLE();  // 使能USART1时钟
        __HAL_RCC_GPIOA_CLK_ENABLE();  // 使能GPIOA时钟（PA9=TX、PA10=RX）

        // 配置PA9（TX）、PA10（RX）为串口复用功能
        GPIO_InitStruct.Pin = GPIO_PIN_10 | GPIO_PIN_9;
        GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;        // 复用推挽（TX需强驱动）
        GPIO_InitStruct.Pull = GPIO_NOPULL;            // 无上/下拉
        GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;  // 高速（匹配串口波特率）
        GPIO_InitStruct.Alternate = GPIO_AF7_USART1;   // 复用映射为USART1（AF7）
        HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

        // 配置串口中断：优先级0（最高），使能中断
        HAL_NVIC_SetPriority(USART1_IRQn, 0, 0);
        HAL_NVIC_EnableIRQ(USART1_IRQn);
    }
}
