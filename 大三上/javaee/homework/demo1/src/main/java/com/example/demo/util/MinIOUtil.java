package com.example.demo.util;


import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class MinIOUtil {
    @Value("${minio.endpoint}")
    private String endpoint;
    @Value("${minio.bucketName}")
    private String bucketName;
    @Value("${minio.accessKey}")
    private String accessKey;
    @Value("${minio.secretKey}")
    private String secretKey;

    private MinioClient minioClient;
    // 项目启动时初始化MinIO客户端
    @PostConstruct
    public void init() {
        minioClient=MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();

    }
    // 上传文件到MinIO
    public boolean uploadFile(String objectName, MultipartFile file) {
        try(InputStream inputStream =file.getInputStream()){
            PutObjectArgs args=PutObjectArgs.builder().bucket(bucketName).object(objectName).stream(inputStream, file.getSize(), -1).contentType(file.getContentType()).build();
            minioClient.putObject(args);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
