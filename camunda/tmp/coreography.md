## specifiche:

>   il cliente richiede la lista dei comuni operativi
```
[x] askCities:      client  ->  ACMeat
```

>   ACMeat restituisce la lista dei comuni operativi
```
[x] returnCities:   ACMeat  ->  client
```

>   il cliente deve inizialmente selezionare un comune tra quelli che offrono il servizio.

```
[x] selectComune:   client  ->  ACMeat
```

>   ACMeat offre la lista dei locali convenzionati ed i menù che offrono: 

```
[x] returnList:     ACMeat  ->  client
```

>   il cliente seleziona quindi il locale ed il menù di suo interesse ed una fascia 
    oraria per la consegna (che sia compresa tra le fasce 12-14 19-21)

```
[x] sendOrder:    client  ->  ACMeat
```

>   segue una fase di pagamento che viene eseguita da un istituto bancario terzo.
    a fronte del pagamento l'istituto bancario rilascia un token di avvenuta transazione
    al cliente, che lo inoltra ad ACMeat che a sua volta verificherà il pagamento con la bancario

```
[x] emitPayment:    client  ->  bank; 
[x] emitToken:      bank    ->  client;
[x] notifyToken:    client  ->  ACMeat;
[x] verifyToken:    ACMeat  ->  bank;
```

---

>   nel caso in cui un locale non fosse disponibile per un dato giorno, dovrà comuinicarlo ad
    ACMeat entro le ore 10:00 del giorno interessato.

```
[x] notifyUnavailability:   center  ->  ACMeat
```

>   i locali vengono contattati ad ogni ordine per verificarne la disponibilità

```
[x] checkAvailability:      ACMeat  ->  center;
[x] confirmAvailability:    center  ->  ACMeat;
```

>   per la consegna, ACMeat si appoggia a più società contemporaneamente, inviando le specifiche dell'ordine
    a tutte le società entro un il raggio di 10km dal comune interessato.

```
[x] askForDelivery:     ACMeat          ->  deliveryCenter;
[x] deliveryAnswer:     deliveryCenter  ->  ACMeat              (contiene il prezzo)
```

>   viene selezionata la società con offerta più conveniente in fattore di prezzo

```
[x] confirmDelivery:    ACMeat  ->  deliveryCenter
```


--- 

---


#   SCENARI

> caso ottimo: 
-   cliente effettua ordine senza problemi
> casi con errori:
-   viene confermato un ordine e più tardi viene cancellato dall'utente stesso
-   viene confermato un ordine e più tardi viene cancellato dal ristoratore
-   il cliente non ha abbastanza credito sul bilancio
-   l'ordine viene rifiutato
-   il partner di consegna cancella la spedizione -> bisogna affidarla ad un altro partner


#   COREOGRAFIE

> caso ottimo
-   cliente effettua ordine senza problemi

> NOTE:
> - La coreografia non è connessa. Ciò non significa che il sistema non funzionerà come dovrebbe, ma che potrebbe non funzionare. Decidiamo di mantenere questo grado di flessibilità in quanto la coreografia si andrebbe a complicare inutilmente (il problema di connectedness riguarda i branch; si dovrebbe avere su entrambi i branch il ruolo di banca). 
```

//   TO-DO fare se il cliente non riesce a pagare
//  cliente che effettua un ordine

( askCities: client -> ACMeat;    returnCities: ACMeat -> client    selectComune: client -> ACMeat;     returnList: ACMeat -> client;   sendOrder: client -> ACMeat;    checkAvailability: ACMeat -> center;   confirmAvailability: center -> ACMeat;
    ( cancelOrder:  ACMeat -> client; )
    +
    ( 
        //  TO-DO   richieste multiple in parallelo
        (askForDelivery: ACMeat -> deliveryCenter; deliveryAnswer: deliveryCenter -> ACMeat; )*
        ( cancelOrder:  ACMeat -> client; )
        + 
        (  
            confirmDelivery: ACMeat -> deliveryCenter;    emitPayment: client -> bank;    emitToken: bank -> client;
            notifyToken: client -> ACMeat;  verifyToken: ACMeat -> bank;
        )
    ))
|
( notifyUnavailability:   center  ->  ACMeat )

```

>  ordine confermato e successivamente cancellato dall'utente
```
( selectComune: client -> ACMeat;     returnList: ACMeat -> client;   sendOrder: client -> ACMeat;    checkAvailability: ACMeat -> center;   confirmAvailability: center -> ACMeat;
    ( cancelOrder:  ACMeat -> client; )
    +
    ( 
        //  TO-DO   richieste multiple in parallelo
        (askForDelivery: ACMeat -> deliveryCenter; deliveryAnswer: deliveryCenter -> ACMeat; )*
        ( cancelOrder:  ACMeat -> client; )
        + 
        (  
            confirmDelivery: ACMeat -> deliveryCenter;    emitPayment: client -> bank;    emitToken: bank -> client;
            notifyToken: client -> ACMeat;  verifyToken: ACMeat -> bank;
        )
    ))
|
( notifyUnavailability:   center  ->  ACMeat )
```