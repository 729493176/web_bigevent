$(function() {
    var form = layui.form
    initCate()
    initEditor()
        // 定义文章加载分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) { return layer.msg('获取文章分类列表失败') }
                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 监听coverfile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options)
    });
    // 定义文章的发布状态
    var art_state = '已发布'

    $('#btn2').on('click', function() {
        art_state = '草稿';
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于表单创建formdata对象
        var fd = new FormData($(this)[0]);
        // 将发布状态存到fd中
        fd.append('state', art_state);

        // 将封面裁剪过后的图片 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                $.ajax({
                    url: '/my/article/add',
                    method: 'post',
                    data: fd,
                    // 如果向服务器提交的是formdata格式的数据
                    // 必须添加一下两个配置项
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status !== 0) { return layer.msg('发布失败') }
                        layer.msg('发布成功');
                    }
                })
            })
    });

    /* function publishArticle(fd) {
        // 发起ajax请求

        $.ajax({
            url: '/my/article/add',
            method: 'post',
            data: fd,
            // 如果向服务器提交的是formdata格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) { return layer.msg('发布失败') }
                layer.msg('发布成功');
            }
        })
    } */
})