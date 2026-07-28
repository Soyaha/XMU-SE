package com.wdd.studentmanager.controller;

import com.wdd.studentmanager.domain.Course;
import com.wdd.studentmanager.service.CourseService;
import com.wdd.studentmanager.util.AjaxResult;
import com.wdd.studentmanager.util.Data;
import com.wdd.studentmanager.util.PageBean;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

public class CourseControllerTest {

    private final CourseController courseController = new CourseController();
    private final FakeCourseService fakeCourseService = new FakeCourseService();

    private PageBean<Course> pageBean;
    private Course course;
    private Data data;

    @Before
    public void setUp() {
        ReflectionTestUtils.setField(courseController, "courseService", fakeCourseService);

        course = new Course();
        course.setId(10);
        course.setName("Java Web");
        course.setTeacherId(3);
        course.setCourseDate("2026-04-29");
        course.setMaxNum(60);
        course.setInfo("基础课程");

        pageBean = new PageBean<>(2, 5);
        pageBean.setDatas(Collections.singletonList(course));
        pageBean.setTotalsize(7);

        data = new Data();
        data.setIds(Arrays.asList(1, 2, 3));

        fakeCourseService.reset();
    }

    @Test
    public void courseListShouldReturnViewName() {
        assertEquals("course/courseList", courseController.courseList());
    }

    @Test
    public void getCourseListShouldReturnPagedMapWhenNotCombox() {
        fakeCourseService.queryPageResult = pageBean;

        Object result = courseController.getClazzList(2, 5, null, "0", null);

        assertTrue(result instanceof Map);
        Map<?, ?> resultMap = (Map<?, ?>) result;
        assertEquals(7, resultMap.get("total"));
        assertSame(pageBean.getDatas(), resultMap.get("rows"));

        Map<String, Object> paramMap = fakeCourseService.lastQueryPageParamMap;
        assertEquals(2, paramMap.get("pageno"));
        assertEquals(5, paramMap.get("pagesize"));
        assertFalse(paramMap.containsKey("name"));
        assertFalse(paramMap.containsKey("teacherId"));
    }

    @Test
    public void getCourseListShouldReturnDataListForCombox() {
        fakeCourseService.queryPageResult = pageBean;

        Object result = courseController.getClazzList(1, 10, "Java", "9", "combox");

        assertTrue(result instanceof List);
        assertSame(pageBean.getDatas(), result);

        Map<String, Object> paramMap = fakeCourseService.lastQueryPageParamMap;
        assertEquals("Java", paramMap.get("name"));
        assertEquals("9", paramMap.get("teacherId"));
    }

    @Test
    public void addCourseShouldReturnSuccessWhenServiceReturnsPositiveCount() {
        fakeCourseService.addCourseResult = 1;

        AjaxResult result = courseController.addCourse(course);

        assertTrue(result.isSuccess());
        assertEquals("添加成功", result.getMessage());
        assertSame(course, fakeCourseService.lastAddCourse);
    }

    @Test
    public void addCourseShouldReturnFailureWhenServiceReturnsZero() {
        fakeCourseService.addCourseResult = 0;

        AjaxResult result = courseController.addCourse(course);

        assertFalse(result.isSuccess());
        assertEquals("添加失败", result.getMessage());
    }

    @Test
    public void addCourseShouldReturnFailureWhenServiceThrowsException() {
        fakeCourseService.addCourseException = new RuntimeException("boom");

        AjaxResult result = courseController.addCourse(course);

        assertFalse(result.isSuccess());
        assertEquals("添加失败", result.getMessage());
    }

    @Test
    public void editCourseShouldReturnSuccessWhenServiceReturnsPositiveCount() {
        fakeCourseService.editCourseResult = 1;

        AjaxResult result = courseController.editCourse(course);

        assertTrue(result.isSuccess());
        assertEquals("修改成功", result.getMessage());
        assertSame(course, fakeCourseService.lastEditCourse);
    }

    @Test
    public void editCourseShouldReturnFailureWhenServiceReturnsZero() {
        fakeCourseService.editCourseResult = 0;

        AjaxResult result = courseController.editCourse(course);

        assertFalse(result.isSuccess());
        assertEquals("修改失败", result.getMessage());
    }

    @Test
    public void editCourseShouldReturnFailureWhenServiceThrowsException() {
        fakeCourseService.editCourseException = new RuntimeException("boom");

        AjaxResult result = courseController.editCourse(course);

        assertFalse(result.isSuccess());
        assertEquals("修改失败", result.getMessage());
    }

    @Test
    public void deleteCourseShouldReturnSuccessWhenServiceReturnsPositiveCount() {
        fakeCourseService.deleteCourseResult = 3;

        AjaxResult result = courseController.deleteCourse(data);

        assertTrue(result.isSuccess());
        assertEquals("删除成功", result.getMessage());
        assertEquals(data.getIds(), fakeCourseService.lastDeleteIds);
    }

    @Test
    public void deleteCourseShouldReturnFailureWhenServiceReturnsZero() {
        fakeCourseService.deleteCourseResult = 0;

        AjaxResult result = courseController.deleteCourse(data);

        assertFalse(result.isSuccess());
        assertEquals("删除失败", result.getMessage());
    }

    @Test
    public void deleteCourseShouldReturnFailureWhenServiceThrowsException() {
        fakeCourseService.deleteCourseException = new RuntimeException("boom");

        AjaxResult result = courseController.deleteCourse(data);

        assertFalse(result.isSuccess());
        assertEquals("删除失败,该班级存在老师或学生", result.getMessage());
    }

    private static class FakeCourseService implements CourseService {
        private Map<String, Object> lastQueryPageParamMap;
        private Course lastAddCourse;
        private Course lastEditCourse;
        private List<Integer> lastDeleteIds;
        private PageBean<Course> queryPageResult;
        private Integer addCourseResult = 1;
        private Integer editCourseResult = 1;
        private Integer deleteCourseResult = 1;
        private RuntimeException queryPageException;
        private RuntimeException addCourseException;
        private RuntimeException editCourseException;
        private RuntimeException deleteCourseException;

        private void reset() {
            lastQueryPageParamMap = null;
            lastAddCourse = null;
            lastEditCourse = null;
            lastDeleteIds = null;
            queryPageResult = null;
            addCourseResult = 1;
            editCourseResult = 1;
            deleteCourseResult = 1;
            queryPageException = null;
            addCourseException = null;
            editCourseException = null;
            deleteCourseException = null;
        }

        @Override
        public PageBean<Course> queryPage(Map<String, Object> paramMap) {
            if (queryPageException != null) {
                throw queryPageException;
            }
            lastQueryPageParamMap = paramMap;
            return queryPageResult;
        }

        @Override
        public int addCourse(Course course) {
            if (addCourseException != null) {
                throw addCourseException;
            }
            lastAddCourse = course;
            return addCourseResult;
        }

        @Override
        public int editCourse(Course course) {
            if (editCourseException != null) {
                throw editCourseException;
            }
            lastEditCourse = course;
            return editCourseResult;
        }

        @Override
        public int deleteCourse(List<Integer> ids) {
            if (deleteCourseException != null) {
                throw deleteCourseException;
            }
            lastDeleteIds = ids;
            return deleteCourseResult;
        }

        @Override
        public List<Course> getCourseById(List<Integer> ids) {
            throw new UnsupportedOperationException("Not needed for this test");
        }

        @Override
        public int findByName(String name) {
            throw new UnsupportedOperationException("Not needed for this test");
        }
    }
}