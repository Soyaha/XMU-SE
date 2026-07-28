package com.whitebox;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class WhiteBoxProgramTest {

    @Test
    public void testStatementCoverage_onePathExecutesBothStatements() {
        assertEquals(2, WhiteBoxProgram.execute(2, 0, 2));
    }

    @Test
    public void testBranchCoverage_trueAndFalseBranches() {
        assertEquals(2, WhiteBoxProgram.execute(2, 0, 2));
        assertEquals(0, WhiteBoxProgram.execute(1, 0, 0));
    }

    @Test
    public void testConditionCoverage_allAtomicConditionsTrueAndFalse() {
        assertEquals(2, WhiteBoxProgram.execute(2, 0, 2));
        assertEquals(0, WhiteBoxProgram.execute(1, 0, 0));
        assertEquals(3, WhiteBoxProgram.execute(3, 1, 2));
    }

    @Test
    public void testBranchConditionCoverage_allBranchesAndConditions() {
        assertEquals(2, WhiteBoxProgram.execute(2, 0, 2));
        assertEquals(0, WhiteBoxProgram.execute(1, 0, 0));
        assertEquals(3, WhiteBoxProgram.execute(3, 1, 2));
    }

    @Test
    public void testAdditionalStatementCoverage_secondPathAlsoExecutesStatement() {
        assertEquals(0, WhiteBoxProgram.execute(3, 0, 2));
    }
}