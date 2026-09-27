import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
    // 1. Busca o cabeçalho onde o token deve estar escondido
    const authHeader = req.headers.authorization;

    // 2. Se não tem cabeçalho, barra na hora
    if (!authHeader) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    // 3. O padrão é enviar "Bearer sdf8sd7f6s8d7f..."
    // Vamos separar a palavra "Bearer" do código do token
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Token mal formatado." });
    }

    const token = parts[1];

    try {
        // 4. Tenta abrir o cofre usando a MESMA chave do seu login
        const payload = jwt.verify(token, "secret-infolight-jwt-16");

        // 5. AQUI A MÁGICA ACONTECE! 
        // Pegamos o "userId" que estava dentro do token e criamos o req.user
        req.user = {
            id: payload.userId,
            userName: payload.userName
        };

        // 6. Tudo certo! Libera a catraca para o Controller executar
        next();

    } catch (error) {
        // 7. Se o token for falso, ou tiver passado de 1 dia, cai aqui
        return res.status(401).json({ error: "Token inválido ou expirado. Faça login novamente." });
    }
}