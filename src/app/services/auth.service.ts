import { Injectable, NgZone } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router'
import { doc, getDoc } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
  ) {
  }

  loginWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
    .then((userData: any) => {
      this.userData = userData.user
      const token = this.userData._delegate.accessToken
      const uuidUSer = this.userData._delegate.uid
      localStorage.setItem('token', token)
      localStorage.setItem('data', JSON.stringify(this.userData))
      localStorage.setItem('idUser', uuidUSer)
      this.loadUserDataFromFiresstore(uuidUSer)
    })
    .catch((error: any) => {
      console.log(error.message)
    })
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return this.userData = userCredential.user?.uid
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  async loadUserDataFromFiresstore(uuid: string): Promise<void> {
    const db = getFirestore()
    const docRef = doc(db, "users", uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const userData = docSnap.data()
      localStorage.setItem('userName', userData?.['name'])
      localStorage.setItem('userLastName', userData?.['lastNane'])
      localStorage.setItem('userEmail', userData?.['email'])
      localStorage.setItem('userType', userData?.['type'])
      this.router.navigate(['/home'])
    } else {
      console.log("No such document!");
    }
  }

  logOut(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('data')
    localStorage.removeItem('idUser')
    localStorage.clear()

    location.reload()
  }

  getToken() {
    return localStorage.getItem('token')
  }
}
