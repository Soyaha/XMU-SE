-- 淘宝用户行为数据仓库 - 物理模型设计 (Hive SQL DDL)

-- 1. 基础设置
SET hive.exec.dynamic.partition.mode=nonstrict;
SET hive.exec.max.dynamic.partitions=2000;

-- =============================================================================
-- ODS 层 (原始数据层)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS ods;

USE ods;

CREATE EXTERNAL TABLE IF NOT EXISTS ods.taobao_user_behavior_ods (
    user_id STRING COMMENT '用户ID',
    item_id STRING COMMENT '商品ID',
    category_id STRING COMMENT '商品类目ID',
    behavior_type STRING COMMENT '行为类型：pv(浏览)/cart(加购)/buy(购买)/fav(收藏)',
    log_ts BIGINT COMMENT '秒级时间戳'
)
COMMENT '淘宝用户行为原始数据层：与源系统日志格式一致，不做清洗'
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
LOCATION '/user/hive/warehouse/taobao_dw.db/ods/taobao_user_behavior/'
TBLPROPERTIES ('skip.header.line.count' = '0');


-- =============================================================================
-- DIM 层 (公共维度层)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS dim;

-- 1. 时间维度表
CREATE TABLE IF NOT EXISTS dim.dim_time (
    dt STRING COMMENT '日期主键（格式：yyyy-MM-dd）',
    dt_hh STRING COMMENT '日期+小时（格式：yyyy-MM-dd HH）',
    year INT COMMENT '年（如2025）',
    quarter INT COMMENT '季度（1-4）',
    month INT COMMENT '月（1-12）',
    day INT COMMENT '日（1-31）',
    hour INT COMMENT '小时（0-23）',
    week INT COMMENT '一年中的第几周（1-52）',
    week_day INT COMMENT '周几（1=周一，7=周日）',
    is_weekend STRING COMMENT '是否周末（Y=是，N=否）',
    is_holiday STRING COMMENT '是否节假日（扩展字段，Y=是，N=否）'
)
COMMENT '时间维度表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/dim/dim_time';

-- 2. 用户维度表
CREATE TABLE IF NOT EXISTS dim.dim_user (
    user_id STRING COMMENT '用户唯一标识（主键）',
    user_lv STRING COMMENT '用户等级（扩展：L1-L5）',
    reg_dt STRING COMMENT '用户注册日期（扩展，格式：yyyy-MM-dd）',
    user_city STRING COMMENT '用户所在城市（扩展）',
    user_province STRING COMMENT '用户所在省份（扩展）'
)
COMMENT '用户维度表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/dim/dim_user';

-- 3. 商品维度表
CREATE TABLE IF NOT EXISTS dim.dim_item (
    item_id STRING COMMENT '商品唯一标识（主键）',
    category_id STRING COMMENT '商品类目ID（关联类目维度表）',
    item_name STRING COMMENT '商品名称（扩展）',
    brand STRING COMMENT '商品品牌（扩展）',
    price DECIMAL(10,2) COMMENT '商品价格（扩展，单位：元）'
)
COMMENT '商品维度表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/dim/dim_item';

-- 4. 商品类目维度表
CREATE TABLE IF NOT EXISTS dim.dim_category (
    category_id STRING COMMENT '类目唯一标识（主键）',
    category_name STRING COMMENT '类目名称（扩展）',
    parent_cate_id STRING COMMENT '父类目ID（扩展，支持类目层级）',
    cate_level INT COMMENT '类目层级（扩展，1=一级，2=二级）'
)
COMMENT '商品类目维度表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/dim/dim_category';

-- 5. 行为类型维度表
CREATE TABLE IF NOT EXISTS dim.dim_behavior_type (
    behavior_type STRING COMMENT '行为类型编码（主键）',
    behavior_name STRING COMMENT '行为名称（中文）',
    behavior_weight INT COMMENT '行为权重（用于计算综合活跃度，如：buy=5, pv=1）'
)
COMMENT '行为类型维度表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/dim/dim_behavior_type';


-- =============================================================================
-- DWD 层 (明细事实层)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS dwd;

CREATE TABLE IF NOT EXISTS dwd.taobao_user_behavior_fact (
    user_id STRING COMMENT '用户维度外键',
    item_id STRING COMMENT '商品维度外键',
    category_id STRING COMMENT '类目维度外键',
    behavior_type STRING COMMENT '行为类型：pv/cart/buy/fav',
    log_ts BIGINT COMMENT '原始时间戳',
    dt_hh STRING COMMENT '时间维度外键（日期+小时）'
)
COMMENT '用户行为明细事实表'
PARTITIONED BY (dt STRING COMMENT '日期分区（yyyy-MM-dd）')
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/dwd.db/taobao_user_behavior_fact';


-- =============================================================================
-- DWS 层 (汇总事实层)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS dws;

-- 1. 类目日行为汇总表
CREATE TABLE IF NOT EXISTS dws.taobao_behavior_cate_agg (
    category_id STRING COMMENT '类目维度外键',
    pv_cnt BIGINT COMMENT '浏览量（度量值）',
    cart_cnt BIGINT COMMENT '加购量（度量值）',
    buy_cnt BIGINT COMMENT '购买量（度量值）',
    fav_cnt BIGINT COMMENT '收藏量（度量值）'
)
COMMENT '按日期+类目汇总的行为事实表'
PARTITIONED BY (dt STRING COMMENT '日期分区（yyyy-MM-dd）')
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/dws.db/taobao_behavior_cate_agg';

-- 2. 用户日行为汇总表
CREATE TABLE IF NOT EXISTS dws.taobao_behavior_user_agg (
    user_id STRING COMMENT '用户维度外键',
    total_behavior_cnt BIGINT COMMENT '总行为数（度量值）',
    buy_cnt BIGINT COMMENT '购买次数（度量值）',
    active_hour INT COMMENT '用户当日最活跃小时（0-23）'
)
COMMENT '按日期+用户汇总的行为事实表'
PARTITIONED BY (dt STRING COMMENT '日期分区（yyyyMMdd）')
STORED AS ORC
LOCATION '/user/hive/warehouse/dws.db/taobao_behavior_user_agg'
TBLPROPERTIES (
    'orc.compress' = 'SNAPPY',
    'orc.create.index' = 'true',
    'orc.bloom.filter.columns' = 'user_id'
);


-- =============================================================================
-- ADS 层 (应用数据层)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS ads;

-- 1. 行为转化漏斗分析表
CREATE TABLE IF NOT EXISTS ads.taobao_conversion_funnel (
    dt STRING COMMENT '日期',
    pv_user_cnt BIGINT COMMENT '浏览用户数',
    cart_user_cnt BIGINT COMMENT '加购用户数',
    fav_user_cnt BIGINT COMMENT '收藏用户数',
    buy_user_cnt BIGINT COMMENT '购买用户数',
    pv2cart_rate DECIMAL(4,4) COMMENT '浏览转加购率',
    pv2fav_rate DECIMAL(4,4) COMMENT '浏览转收藏率',
    pv2buy_rate DECIMAL(4,4) COMMENT '浏览转购买率',
    cart2buy_rate DECIMAL(4,4) COMMENT '加购转购买率'
)
COMMENT '用户行为转化漏斗表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_conversion_funnel';

-- 2. 热门商品 TOP10 表
CREATE TABLE IF NOT EXISTS ads.taobao_hot_item_top10 (
    dt STRING COMMENT '日期',
    item_rank INT COMMENT '排名（1-10）',
    item_id STRING COMMENT '商品ID',
    pv_cnt BIGINT COMMENT '商品浏览量',
    buy_cnt BIGINT COMMENT '商品购买量',
    buy2pv_rate DECIMAL(4,4) COMMENT '商品购买转化率'
)
COMMENT '每日热门商品TOP10表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_hot_item_top10';

-- 3. 日活跃用户数（DAU）表
CREATE TABLE IF NOT EXISTS ads.taobao_user_dau (
    dt STRING COMMENT '日期',
    dau BIGINT COMMENT '日活跃用户数',
    mau_7d BIGINT COMMENT '7日累计活跃用户数',
    active_rate DECIMAL(4,4) COMMENT '日活跃率'
)
COMMENT '日活跃用户数表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_user_dau';

-- 4. 分时流量趋势表
CREATE TABLE IF NOT EXISTS ads.taobao_traffic_hourly_stats (
    dt STRING COMMENT '日期',
    hour STRING COMMENT '小时',
    pv_cnt BIGINT COMMENT '浏览次数',
    cart_cnt BIGINT COMMENT '加购次数',
    fav_cnt BIGINT COMMENT '收藏次数',
    buy_cnt BIGINT COMMENT '购买次数'
)
COMMENT '分时流量趋势表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_traffic_hourly_stats';

-- 5. 热门品类 Top10 表
CREATE TABLE IF NOT EXISTS ads.taobao_category_top10 (
    dt STRING COMMENT '日期',
    cate_rank INT COMMENT '排名',
    category_id STRING COMMENT '类目ID',
    pv_cnt BIGINT COMMENT '浏览量',
    buy_cnt BIGINT COMMENT '购买量',
    conversion_rate DECIMAL(4,4) COMMENT '购买转化率'
)
COMMENT '每日热门品类Top10'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_category_top10';

-- 6. 用户复购率统计表
CREATE TABLE IF NOT EXISTS ads.taobao_repurchase_stats (
    dt STRING COMMENT '日期',
    buy_user_cnt BIGINT COMMENT '购买用户数',
    repurchase_user_cnt BIGINT COMMENT '复购用户数(购买次数>1)',
    repurchase_rate DECIMAL(4,4) COMMENT '复购率'
)
COMMENT '用户复购指标表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS ORC
LOCATION '/user/hive/warehouse/taobao_dw.db/ads/taobao_repurchase_stats';
