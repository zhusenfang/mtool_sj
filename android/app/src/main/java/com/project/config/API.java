package com.project.config;

/**
 * Created by sshss on 2017/6/23.
 */

public class API {

    private static final String HOST = "http://39.106.205.201";
    private static final String BASE_URL = HOST + "/mtool/portal/api/";
    public static final String UPLOAD_URL = "http://img.dahonghuo.com.cn/fileService/file/upload/png";
    public static final String LOGIN = BASE_URL + "user/member/login";
    public static final String VIDEO_UPLOAD_ADD = BASE_URL + "forum/videoUpload/createUploadVideo";
    public static final String GROUP_MEMBERS = BASE_URL + "user/member/finduser_by_hxgroupId";
}
