#include <iostream>

#include <string>

using namespace std;



struct CharNode {

	char val;

	CharNode* next;

	CharNode(char c) : val(c), next(NULL) {} // struct中的构造函数，用于对结点的初始化

};



//StringToList函数将字符串（string类）转化为链表，该函数返回链表的头指针

CharNode* StringToList(const string& str) {

	CharNode dummy(0);

	CharNode* tail = &dummy;

	for (int i = 0; i < str.size(); ++i) {

		char c = str[i];

		CharNode* newNode = new CharNode(c);

		tail->next = newNode;

		tail = newNode;

	}

	return dummy.next;

}



//FreeList函数清理链表

void FreeList(CharNode* head) {

	while (head) {

		CharNode* temp = head;

		head = head->next;

		delete temp;

	}

}



// StrToInt函数将链表转换为字符串（string类）

string StrToInt(CharNode* head) {

	// 本函数需要你补充完整
	CharNode* a = head;
	char str[1000];
	int i = 0;
	while (a) {
		str[i++] = a->val;
		a = a->next;
	}
	int b = atoi(str);
	string c=to_string(b);

	return c;
	//int sign = 1;
	//int result = 0;
	//CharNode* cur = head;

	//// 跳过前导空格
	//while (cur && cur->val == '') {
	//	cur = cur->next;
	//}

	//// 处理符号
	//if (cur && (cur->val == '+' || cur->val == '-')) {
	//	if (cur->val == '-') {
	//		sign = -1;
	//	}
	//	cur = cur->next;
	//}

	//// 处理数字并检查溢出
	//while (cur && isdigit(cur->val)) {
	//	int digit = cur->val - '0';
	//	if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > INT_MAX % 10)) {
	//		return sign == 1 ? to_string(INT_MAX) : to_string(INT_MIN);
	//	}
	//	result = result * 10 + digit;
	//	cur = cur->next;
	//}

	//return to_string(sign * result);
}


int main() {

	string input;

	getline(cin, input); //从输入中读取一整行数据到input中

	if (!input.empty() && input.front() == '"') {

		input = input.substr(1); // 去掉输入字符串中开头的引号

	}

	if (!input.empty() && input.back() == '"') {

		input = input.substr(0, input.size() - 1);// 去掉输入字符串中末尾的引号

	}

	CharNode* head = StringToList(input);

	string result = StrToInt(head);

	cout << result << endl;

	FreeList(head);

	return 0;

}