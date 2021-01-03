$(function() {

    initUserInfo()

    $('#userinfo').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新信息失败');
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法从新渲染用户头像信息
                window.parent.getUserInfo()
            }
        })
    })

    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    })

    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    })


    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                form.val('formUserInfo', res.data)
            }
        })
    }


})