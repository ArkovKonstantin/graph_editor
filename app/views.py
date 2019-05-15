# -*- coding: utf-8 -*-
from flask import render_template, redirect
from app import app
from app.forms import LoginForm, RegisterForm


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    # if form.validate_on_submit():
    #     user = User.query.filter_by(username=form.username.data).first()
    #     if user:
    #         if check_password_hash(user.password, form.password.data):
    #             login_user(user, remember=form.remember.data)
    #             return redirect(url_for('dashboard'))
    #
    #     return '<h1>Invalid username or password</h1>'
        #return '<h1>' + form.username.data + ' ' + form.password.data + '</h1>'

    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    # if form.validate_on_submit():
    #     hashed_password = generate_password_hash(form.password.data, method='sha256')
    #     new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
    #     db.session.add(new_user)
    #     db.session.commit()
    #
    #     return '<h1>New user has been created!</h1>'
        #return '<h1>' + form.username.data + ' ' + form.email.data + ' ' + form.password.data + '</h1>'

    return render_template('signup.html', form=form)
