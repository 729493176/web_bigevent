$(function() {
    // 点击去注册按钮跳转到注册页面
    $('#link-reg').on('click', function() {
        $('.login').hide();
        $('.reg-box').show();
    });
    // 点击去登录按钮去登录页面
    $('#link-login').on('click', function() {
        $('.reg-box').hide();
        $('.login').show();
    });
    // 从layui中获取form对象
    var form = layui.form;
    //通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,16}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次密码不一致!'
            }
        }
    });
    // 注册账号 监听注册表单的提交事件
    var layer = layui.layer;
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        /* $.post('http://ajax.frontend.itheima.net/api/reguser', {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }, function(res) {
            if (res.status !== 0) {
                return console.log(res.message);
            }
            console.log('注册成功');
        }); */
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }
        $.ajax({
            type: 'post',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#link-login').click();
            }
        })
    })
})