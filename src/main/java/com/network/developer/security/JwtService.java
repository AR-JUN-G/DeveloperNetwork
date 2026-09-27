package com.network.developer.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "F67NTeDCnj9CdFIqdW9gSablDC8M5WX5lSIWUEmPhptjKWvXJ96yTh6WU9ljxmQC3PYJnOQ07uPyNwODGAzus9";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /*Need to understand this function*/
    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24)))
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return ((username.equals(userDetails.getUsername())) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigninKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}


/*
*   Claims are the Body of the JWT
        extractClaim:
*           What are Claims? This is just the "body" of the JWT containing your data (like email, issued date, expiration date) stored as
*           key-value pairs.
            The Problem it Solves:
            *   Without this function, if you wanted the user's email, you’d write a method to parse the token and grab the subject.
            *   If you later wanted the expiration date, you’d write another method doing the exact same parsing steps,
            *   just grabbing a different field.

            How it Works:
                This is a generic higher-order function using Java 8 functional programming. You pass it the token and a "recipe" (a lambda or method reference)
                telling it which specific piece of data you want.
                For example:
                extractClaim(token, Claims::getSubject) pulls the email.
                extractClaim(token, Claims::getExpiration) pulls when it expires.
                It keeps your code clean and dry (DRY principle).
*
*
*
*
*
*
*
* */
