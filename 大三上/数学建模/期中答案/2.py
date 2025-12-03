from datetime import datetime

# （1）将字符串 "2024-03-15" 转换为日期对象
date_str = "2024-03-15"
date_obj = datetime.strptime(date_str, "%Y-%m-%d")

# （2）将日期对象格式化为指定格式
# 格式1："15/03/2024"对应"%d/%m/%Y"
format1 = date_obj.strftime("%d/%m/%Y")

# 格式2："March 15, 2024"对应"%B %d, %Y"
format2 = date_obj.strftime("%B %d, %Y")

print("转换后的日期对象：", date_obj)
print("格式化为'15/03/2024'：", format1)
print("格式化为'March 15, 2024'：", format2)