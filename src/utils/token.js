export function generateToken() {
  let token = "";
  const characters = "ABCDEFGHIKLMNOPQRSTUVWYZabcdefghiklmnoqprstuvwyz0123456789"

  for (let i = 0; i <= 20; i++) {
    let random = Math.floor(Math.random() * characters.length)
    
    token += characters[random];
  }

  return token; 
}

generateToken()