# -*- coding: utf-8 -*-
from flask import render_template, redirect, url_for, flash, request, json
from app import app, db
from app.forms import LoginForm, RegisterForm
from flask_login import current_user, login_user, logout_user
from app.models import User, Graph


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))

        login_user(user, remember=form.remember.data)

        return redirect(url_for("index"))

    return render_template("login.html", form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/signup', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('signup.html', title='Register', form=form)


@app.route('/save', methods=['POST'])
def save_graph():

    graph_title = request.form['graph_title']
    graph = request.form['graph']
    # создание и сохранение графа в бд
    g = Graph(title=graph_title, body=graph, author=current_user)
    db.session.add(g)
    db.session.commit()

    return "OK"


@app.route('/get_graph_lst', methods=['POST']) 
def get_graph_lst():
    d = {}
    for g in current_user.graphs:
        d[g.title] = g.body

    return json.dumps(d)    
