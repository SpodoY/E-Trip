export default function ({app, route, redirect}){
  if (route.path === '/ProfilePage' || route.path === '/addcar'  || route.path === '/ProfileCreation') {
    //we are on a protected route
    if(!app.$fire.auth.currentUser) {
      //take them to sign in page
      return redirect('/auth/Login')
    }
  } else if (route.path === '/auth/login' || route.path === '/auth/signup' ) {
    if(!app.$fire.auth.currentUser) {
      //leave them on the sign in page
    } else {
      return redirect('/ProfilePage')
    }
  }
}
