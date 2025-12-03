package com.example.demo.controller;

import com.example.demo.util.MinIOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;

@Controller
public class FileUploadController {
    @Autowired
    private MinIOUtil minIOUtil;

    @GetMapping("/")
    public String showUploadPage() {
        return "upload";
    }
    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file,Model model) {
        String groupNumber="oomall-2班-7组";
        if(file.isEmpty()){
            model.addAttribute("message","请选择文件");
            return "upload";
        }
        try {
            boolean isSuccess = minIOUtil.uploadFile(groupNumber, file);
            model.addAttribute("message", isSuccess ? "上传成功！" : "上传失败！");
        } catch (Exception e) {
            model.addAttribute("message", "上传异常：" + e.getMessage());
        }

        return "upload";
    }
}
