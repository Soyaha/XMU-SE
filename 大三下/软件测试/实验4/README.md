# JUnit 白盒测试示例

这是一个基于 JUnit4 的白盒测试示例，对如下程序进行测试：

```java
if (A > 1 && B == 0)
    X = X / A;
if (A == 2 || X > 1)
    X = X + 1;
```

## 运行方式

在项目根目录执行：

```bash
mvn test
```

## 测试说明

- `testStatementCoverage_onePathExecutesBothStatements`：语句覆盖
- `testBranchCoverage_trueAndFalseBranches`：分支覆盖
- `testConditionCoverage_allAtomicConditionsTrueAndFalse`：条件覆盖
- `testBranchConditionCoverage_allBranchesAndConditions`：分支-条件覆盖
- `testAdditionalStatementCoverage_secondPathAlsoExecutesStatement`：补充的语句覆盖路径

## 测试套装

测试套装文件为 `src/test/java/com/whitebox/WhiteBoxTestSuite.java`，统一执行 `WhiteBoxProgramTest` 中的所有测试方法。