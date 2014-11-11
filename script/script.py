import os

if os.geteuid() != 0:
    exit("You need to have root privileges to run this script.\nPlease try again, this time using 'sudo'. Exiting.")

import urllib, json

response = urllib.urlopen("http://10.0.1.2/data/resources.json")
data = json.loads(response.read())

if data["ip"] in open("/etc/hosts").read():
    print "/etc/hosts already contains a line for " + data["ip"]
else:
    with open("/etc/hosts", "a") as myfile:
        myfile.write(data["ip"] + " " + data["url"] + " " + " ".join([x["url"] for x in data["data"]]))
    print "/etc/hosts updated, you may now visit http://" + data["url"] + "/"
