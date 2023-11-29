import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: Firestore
  ) {}

  getAll(): Observable<any[]> {
    const user = collection(this.firestore, 'users')
    return collectionData(user, {idField: 'id'})
  }

  getById(id: string): Observable<any> {
    const user = doc(this.firestore, 'users', id)
    return new Observable<any>((observer) => {
      getDoc(user)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            observer.next({ id: docSnapshot.id, ...docSnapshot.data() })
          } else {
            observer.error('Document does not exist.')
          }
        })
        .catch((error) => {
          observer.error(error)
        })
    });
  }

  async save(user: any): Promise<void> {
    const collectionRef = collection(this.firestore, 'users')
    const docRef = doc(collectionRef, user.id)
    await setDoc(docRef, user)
  }

  async update(id: string, user: any): Promise<void> {
    const documentRef = doc(this.firestore, 'users', id)
    await updateDoc(documentRef, user)
  }


  delete(id: number) {
    const collectionRef = doc(this.firestore, `users/${id}`)
    return deleteDoc(collectionRef)
  }
}
