$(".page_btn").click(function(){
    const page = $(this).data("page");
    window.location.href = `/${page}`;
})

$("#uploadForm").submit(function (event) {
    let path_name = location.pathname.substring(1);  // 获取路径名
    console.log(path_name);
    event.preventDefault();  // 防止表单提交后跳转

    let formData = new FormData();
    let fileInput = $("#excelFile")[0].files[0];
    console.log(fileInput);

    // 检查是否选择文件
    if (!fileInput) {
        Swal.fire("錯誤", "請選擇一個檔案", "error");
        return;
    }

    // 检查文件名是否正确
    if (fileInput.name !== path_name + ".xlsx") {
        Swal.fire({
            title: "檔案名稱錯誤",
            text: `檔案名稱須為 ${path_name}.xlsx`,
            icon: "error",
            showCancelButton: true
        });
        return;  // 如果文件名不符合，终止上传
    }

    formData.append("file", fileInput);  // 将文件附加到 formData 对象

    // 发送 AJAX 请求
    $.ajax({
        url: "/upload",  // Flask 路由 URL
        type: "POST",
        data: formData,
        processData: false,  // 不处理数据
        contentType: false,  // 不设置 Content-Type，因为它会自动根据 FormData 设置
        success: function (response) {
            // 假设后端返回 JSON 数据
            // 提示用户文件转换成功并提供下载链接
            Swal.fire({
                title: "轉換成功！",
                text: "已轉換成JSON檔案",
                icon: "success",
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // 如果用户点击了确认，触发文件下载
                    const link = document.createElement('a');
                    link.href = response.file_url;  // 假设后端返回一个下载链接
                    link.download = 'converted_data.json';  // 设置下载文件名
                    link.click();
                }
            });
        },
        error: function () {
            Swal.fire({
                title: "檔案上傳失敗",
                text: "請確認檔案名稱及內容",
                icon: "error",
                showCancelButton: true
            });
        }
    });
});