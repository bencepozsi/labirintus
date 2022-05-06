Pozsár Bence Zsolt

Az ELTE Informatika Kar webprogramozás tárgy 1. beadandójára készült megoldás javascriptben.

Feladat szövege:
Nekeresdországban Nevenincs királynak egyik szeme sír, a másik nevet. Nevet, mert tündérszép lányának kérője akadt, és sír, mert a kiváló kérőből nem egy, hanem több is van. Hát most hogyan döntse el, melyiknek adja lánya kezét és fele királyságát? Gondolja kikéri udvari tanácsosa, Furfang véleményét. Az udvari tanácsos nevéhez illő ötlettel áll elő: állítsák próba elé a kérőket, s aki a legrátermettebbnek bizonyul, az nyerje el a szépséges királylány kezét. Van a várnak egy elvarázsolt katakombája, ahol a szobák helye folyamatosan változtatható. Ebben rejtenek el kincseket, s az a kérő nyeri el a királylány kezét, aki a leghamarabb szedi össze a rábízott kincseket.

A játék leírása:
A katakomba szobáit egy 7x7-es négyzetrács cellái jelképezik. Minden szoba esetén adott, hogy mely falain van ajtó. Ha két szomszédos szoba érintkező falán egy-egy ajtó van, akkor át lehet menni egyik szobából a másikba. A négyzetrács páros sorait és oszlopait el lehet tolni, a többi szoba végig rögzített a játék során. Az eltolásokkal az ajtókon keresztül utak nyílnak a szobák között, így lehet eljutni a kincsekhez. Mindegyik kérő arra törekszik, hogy a katakomba szobáinak ötletes eltolásával eljusson a kincsekhez. Aki elsőként találja meg mindahányat és kiindulópontjára sikeresen visszaérkezik az a nyertes.

A játék elején a szobákat véletlen sorrendben és véletlen irányban kirakjuk a játéktábla szabad mezőire. A szobák közül az egyik mindenképpen fölösleges marad. A játék folyamán majd mindig az éppen kimaradó szobát használjuk a többi szoba elcsúsztatására. A játékban legfeljebb 24 kincset kell megtalálni. Ezeket véletlen sorrendben felrakjuk a táblára úgy, hogy egy mezőn csak egy kincs lehet, és a sarokba nem rakhatunk, majd az ezeket jelző kártyákat összekeverjük, és egyenlő számban szétosztjuk a játékosok között, felfedve mindig a legfelső kártyát. A játékosokat jelző figurákat a tábla külön sarkaiba helyezzük.

A játék során minden játékosnak a kincsei közül azt kell megszereznie, amit az aktuálisan legfelső, mindenki által látható kincskártya mutat. Arra a mezőre kell eljutni. Ahhoz, hogy a célt elérje, a játékosnak
    - először a katakombát kell átalakítania a kimaradt szoba becsúsztatásával, és
    - lépnie mindig csak ez után szabad a figurájával.
A katakomba átalakítása a következőképpen történik: A játékos a kimaradt szobát (tetszőlegesen elforgatva) valamelyik oldalról becsúsztathatja a játéktábla területére egy szabadon mozgó sor vagy oszlop szélén, aminek következtében az átellenes oldalon kiesik egy másik szoba. A tábla szélén nyilak jelzik azokat a helyeket, ahol a szobát be lehet csúsztatni. A szoba bárhol betolható, kivétel ott, ahol az imént kilökődött. Nem szabad tehát az előző játékos lépését rögtön „visszacsinálni". Ha a szobák eltolása során a szobával együtt egy figura is kitolódnék – akár másé, akár a miénk -, akkor ezt a figurát az ellenkező oldalról imént becsúsztatott szobába kell helyezni.

A szobák eltolását követi a játékos lépése a figurával. A katakomba minden olyan pontjáig el lehet jutni, amelyet a kiindulóponttal folyamatos járatvonal köt össze. Az ilyen járatokban tehát olyan messzire mehetünk el, amilyen messzire csak akarunk, vagyis nem számít, hogy hány szobán lépkedünk végig. Nem kötelező lépni. Figuránkat akár ott is hagyhatjuk, ahol éppen van. Egy mezőn több figura is állhat: a figurák nem ütik ki egymást. Ha valaki nem tud rögtön céljáig eljutni, akkor figurájával addig a pontig célszerű elmennie, ahol feltehetőleg jó helyzetben várhatja következő lépést. Ha valaki elérte a felfedett kincskártya által megjelölt célt, akkor felfedi a következőt, és most ehhez a célhoz igyekszik eljutni, stb.

A játék akkor ér véget, ha egy játékos az összes kincskártyájához tartozó kincset megszerezte, és visszavezette a figuráját arra mezőre, ahonnan elindult. Az a győztes, aki valamennyi kincsét megtalálta és figuráját elsőként juttatta vissza a kiindulópontra.