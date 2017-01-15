f = open("10m.test", "bw")
for i in range(10 * 1024 * 1024):
    f.write(b'0')
f.close()

