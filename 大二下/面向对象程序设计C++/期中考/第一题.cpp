#include <iostream>
#include <sstream>
#include <string>
#include <cctype>
using namespace std;
struct ListNode {
	int val;
	ListNode* next;
	ListNode(int x) : val(x), next(NULL) {} // 在 struct 中也可以写构造函数，用于对数据的初始化。例如， ListNode x(5) 表示：创建结构体变量x，其中 x.val 为 5， x.next 为空。
};
//create_list 函数用于从输入数据中创建链表，并返回链表头指针
ListNode* create_list(const string& s) {
	stringstream ss(s);
	string token;
	ListNode* head = NULL;
	ListNode* tail = NULL;
	while (getline(ss, token, '-')) {
		while (!token.empty() && !isdigit(token[0])) {// 删除非数字的字符
			token.erase(token.begin());
		}if (token.empty() || token == "NULL") continue;
		int num = stoi(token);
		ListNode* node = new ListNode(num);
		if (!head) {
			head = node;
			tail = node;
		}
		else {
			tail->next = node;
			tail = node;
		}
	}
	return head;
}
//delete_duplicates 函数用于删除链表中的重复结点，并返回新链表的头指针
ListNode* delete_duplicates(ListNode* head) {
	//本函数需要你补充完整
	ListNode* a = head;
	ListNode* p1 = head,*p2=head,*h=head;
	while (a->next) {
		a = a->next;
		if (p1->val == a->val) {
			while (a->next&&a->next->val == p1->val) {
				a = a->next;
			}
			p2->next = a->next;
			free(p1);
		}
		else p2 = p2->next;
	}
	return h;
}
//print_list 函数用于将链表打印出来
void print_list(ListNode* head) {
	ListNode* cur = head;
	while (cur) {
		cout << cur->val; if (cur->next) cout << "->";
		cur = cur->next;
	}
	cout << "->NULL" << endl;
}
int main() {
	string list_str;
	getline(cin, list_str); // 从输入中读取一整行数据到 list_str 中
	ListNode* head = create_list(list_str);
	ListNode* new_head = delete_duplicates(head);
	print_list(new_head);
	return 0;
}