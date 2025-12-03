#include "book.h"

Book::Book(int ID, string name, string author, string publishing_house)
    : ID(ID), name(name), author(author), publishing_house(publishing_house), state({ true, "" }) {}

int Book::get_ID() { return ID; }
string Book::get_name() { return name; }
string Book::get_author() { return author; }
string Book::get_publishing_house() { return publishing_house; }
bool Book::get_state() { return state.first; }

void Book::change_state() {
    state.first = !state.first;  // 切换状态
    if (state.first) state.second = "";  // 归还时清空借阅者
}

void Book::change_state(string borrower) {
    state.first = false;  // 标记为已借
    state.second = borrower;
}

void Book::print_message() {
    cout << "ID:" << ID << endl
        << "name:" << name << endl
        << "author:" << author << endl
        << "publishing_house:" << publishing_house << endl;
    if (state.first) {
        cout << "state:loanable" << endl;
    }
    else {
        cout << "borrower:" << state.second << endl
            << "state:borrowed" << endl;
    }
}