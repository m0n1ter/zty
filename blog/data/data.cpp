#include<cstdio>
#include<cstring>
#include<ctime>
#include<direct.h>
#include<iostream>
#include<algorithm>
#include<string>
#include<iomanip>
#include<fstream>
#include<vector>
#include<cstdlib>
#include<windows.h>
using namespace std;
typedef long long LL;
#define dec DECDECDEC
int n, n_old;
void getFiles(string path, vector <string> &files)//获取path目录下的文件列表
{
	long hFile = 0;
	struct _finddata_t fileinfo;
	string p;
	if((hFile = _findfirst(p.assign(path).append("/*").c_str(), &fileinfo)) != -1)
	{
		do
		{
			if(fileinfo.attrib & _A_SUBDIR)
			{
				if(strcmp(fileinfo.name, ".") != 0 && strcmp(fileinfo.name, "..") != 0 )
					getFiles(p.assign(path).append("/").append(fileinfo.name), files );
			}
			else
				files.push_back(p.assign(path).append("/").append(fileinfo.name));
		} while(_findnext(hFile, &fileinfo) == 0);
		_findclose(hFile);
	}
}
struct Data //记录数据
{
	string data;
	LL imei_total, imei_match, imei_uniq; double imei_mt, imei_um;
	LL imsi_total, imsi_match, imsi_uniq; double imsi_mt, imsi_um;
	LL mdn_total, mdn_match, mdn_uniq; double mdn_mt, mdn_um;
} ;
struct White
{
	int id;
	string type, source, key, url, host;
	string hash;
} white[10000], white_old[10000];
bool cmp(White a, White b) {return a.hash < b.hash;}
vector <int> add, dec;
void make_add()
{
	add.clear(); dec.clear();
	sort(white, white+n, cmp);
	sort(white_old, white_old+n_old, cmp);
	int p = 0;
	for(int i = 0; i < n; i++)
	{
		while(white_old[p].hash < white[i].hash && p < n_old) ++p;
		if(white_old[p].hash > white[i].hash || p >= n_old) add.push_back(i);
	}
	p = 0;
	for(int i = 0; i < n_old; i++)
	{
		while(white[p].hash < white_old[i].hash && p < n) ++p;
		if(white[p].hash > white_old[i].hash || p >= n) dec.push_back(i);
	}
	return;
}
int main()
{
	string str;
	cout<<"Data processing...."<<endl;
	vector <string> files;
	getFiles("new", files);
	ofstream fout("log");
	for(int i = 0; i < files.size(); i++)
	{
		Data now;
		now.data = files[i].substr(18, 8);
		int imei = 0, imsi = 0, mdn = 0;
		string str;
		ifstream fin(files[i].c_str());
		while(getline(fin, str)) //处理数据
		{
			char s[1000];
			if(str.substr(0, 10) == "imei Total")
			{
				//cout<<str<<endl;
				sscanf(str.c_str(), "%s%s%I64d%s%I64d", s, s, &now.imei_total, s, &now.imei_match);
			}
			else if(str.substr(0, 10) == "imsi Total")
			{
				sscanf(str.c_str(), "%s%s%I64d%s%I64d", s, s, &now.imsi_total, s, &now.imsi_match);
			}
			else if(str.substr(0, 9) == "mdn Total")
			{
				sscanf(str.c_str(), "%s%s%I64d%s%I64d", s, s, &now.mdn_total, s, &now.mdn_match);
			}
			if(str.substr(0, 8) == "uniqimei")
			{
				sscanf(str.c_str(), "%s%I64d", s, &now.imei_uniq);
				now.imei_mt = 1.0*now.imei_match / now.imei_total;
				now.imei_um = 1.0*now.imei_uniq / now.imei_match;
			}
			if(str.substr(0, 8) == "uniqimsi")
			{
				sscanf(str.c_str(), "%s%I64d", s, &now.imsi_uniq);
				now.imsi_mt = 1.0*now.imsi_match / now.imsi_total;
				now.imsi_um = 1.0*now.imsi_uniq / now.imsi_match;
			}
			if(str.substr(0, 7) == "uniqmdn")
			{
				sscanf(str.c_str(), "%s%I64d", s, &now.mdn_uniq);
				now.mdn_mt = 1.0*now.mdn_match / now.mdn_total;
				now.mdn_um = 1.0*now.mdn_uniq / now.mdn_match;
				break;
			}
		}
		fout<<now.data<<" "<<now.imei_total<<" "<<now.imei_match<<" "<<now.imei_uniq<<" "<<now.imei_mt*100<<"% "<<now.imei_um*100<<"% "
			<<now.imsi_total<<" "<<now.imsi_match<<" "<<now.imsi_uniq<<" "<<now.imsi_mt*100<<"% "<<now.imsi_um*100<<"% "
			<<now.mdn_total<<" "<<now.mdn_match<<" "<<now.mdn_uniq<<" "<<now.mdn_mt*100<<"% "<<now.mdn_um*100<<"% "; //将汇总数据写入log文件

		string sss = "white/whitelist_" + files[i].substr(18);
		ifstream fwhite(sss.c_str());
		if(n > 0)
		{
			n_old = n;
			for(int j = 0; j < n; j++) white_old[j] = white[j];
		}
		n = 0;
		while(getline(fwhite, str))
		{
			char s[1000], type[1000], type2[1000], type3[1000], host[1000];
			sscanf(str.c_str(), "%d%s%s%s%s%s", &white[n].id, type, type2, type3, s, host);
			white[n].url = string(s);
			white[n].type = string(type);
			white[n].source = string(type2);
			white[n].key = string(type3);
			white[n].host = string(host);
			white[n].hash = white[n].type + white[n].source + white[n].key + white[n].url;
			if(white[n].type == "imei") imei = max(imei, n+1);
			if(white[n].type == "imsi") imsi = max(imsi, n+1);
			if(white[n].type == "mdn") mdn = max(mdn, n+1);
			++n;
		}
		fwhite.close();
		mdn = mdn - imsi;
		imsi = imsi - imei;
		fout<<imei<<" "<<imsi<<" "<<mdn<<endl;
		string file_this = "data/" + files[i].substr(18);
		ofstream fff(file_this.c_str());
		bool f = 1, f2 = 0;
		while(getline(fin, str))
		{
			int id;
			LL total, match, uniq;
			double mt, um;
			string url;
			char s[100];
			sscanf(str.c_str(), "%d%I64d%I64d%s%I64d", &id, &total, &match, s, &uniq);
			mt = 1.0 * match / total;
			um = 1.0 * uniq / match;
			fff<<id<<" "<<total<<" "<<match<<" "<<uniq<<" ";
			if(total) fff<<fixed<<setprecision(2)<<mt*100<<" "; else fff<<"-1 ";
			if(match) fff<<fixed<<setprecision(2)<<um*100<<" "; else fff<<"-1 ";
			bool flag = 0;
			for(int i = 0; i < n; i++)
			{
				if(white[i].id == id)
				{
					if(flag == 1) cout<<file_this<<"something wrong in whitelist!"<<endl;
					flag = 1;
					fff<<white[i].type<<" "<<white[i].source<<" "<<white[i].key<<" "<<white[i].url<<endl;
				}
			}
			if(!flag) 
			{
				fff<<endl; 
				f = 0;
			}
			else f2 = 1;
		}//将每日数据写入对应文件
		fff.close();
		if(n > 0 && n_old > 0 && i > 0)
		{
			make_add();
			file_this = "data5/" + files[i].substr(18) + "_add";
			ofstream fff1(file_this.c_str());
			for(int j = 0; j < add.size(); j++)
			{
				int k = add[j];
				fff1<<white[k].type<<" "<<white[k].source<<" "<<white[k].key<<" "<<white[k].host<<" "<<white[k].url<<endl;
			}
			fff1.close();
			file_this = "data5/" + files[i].substr(18) + "_dec";
			ofstream fff2(file_this.c_str());
			for(int j = 0; j < dec.size(); j++)
			{
				int k = dec[j];
				fff2<<white_old[k].type<<" "<<white_old[k].source<<" "<<white_old[k].key<<" "<<white_old[k].host<<" "<<white_old[k].url<<endl;
			}
			fff2.close();
		}
		if(f == 1)
		{
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY|FOREGROUND_GREEN);
			cout<<"    ."<<files[i].substr(18)<<" completed!"<<endl;
		}
		else if(f2 == 0) 
		{
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY|FOREGROUND_RED);
			cout<<"    ."<<files[i].substr(18)<<" no whitelist!"<<endl;
		}
		else
		{
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY|FOREGROUND_RED);
			cout<<"    ."<<files[i].substr(18)<<" missing data in the whitelist!"<<endl;
		}
		SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY);
	}
	cout<<"data processing is successfully!"<<endl;
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY|FOREGROUND_RED|FOREGROUND_BLUE|FOREGROUND_GREEN);
	return 0;
}
