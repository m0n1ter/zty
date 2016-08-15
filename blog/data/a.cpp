#include <WinSock2.h>
#include <iostream>
#include<cstdio>
using namespace std;
#pragma comment(lib, "ws2_32.lib");

int main()
{
	WSADATA wsaData;
	WORD sockVersion = MAKEWORD(2, 2);
	::WSAStartup(sockVersion, &wsaData);

	char lv_name[50];
	gethostname(lv_name, 50);
	hostent * lv_pHostent;
	lv_pHostent = (hostent *)malloc(sizeof(hostent));
	if( NULL == (lv_pHostent = gethostbyname(lv_name)))
	{
		printf("get Hosrname Fail \n");
		return 0;
	}
	SOCKADDR_IN lv_sa;
	lv_sa.sin_family = AF_INET;
	lv_sa.sin_port = htons(6000);
	memcpy(&lv_sa.sin_addr.S_un.S_addr, lv_pHostent->h_addr_list[0], lv_pHostent->h_length);
	printf("%s\n", inet_ntoa(lv_sa.sin_addr));
	free(lv_pHostent);
	return 0;
}