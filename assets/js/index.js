$(function() {

    //调用getUserInfo 获取用户基本信息
    getUserInfo();

    $('#logout').on('click', function() {
        layer.confirm('确定要退出?', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储
            localStorage.removeItem('token')
                // 跳转到登录页面
            location.href = '/login.html'
                // 关闭confirm询问框
            layer.close(index);
        });
    })

})


function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',

        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //调用渲染用户头像的函数
            renderAvatar(res.data);
        }
    })
}

function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.设置头像
    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();

    } else {
        // 文本头像
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first).show()
    }
}