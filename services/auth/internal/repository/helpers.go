package repository

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/smtp"
)

func GenerateRandomCode() (string, error) {
	const op = "repository.helpers.GenerateRandomCode"

	const codeLength = 6
	var code string
	for i := 0; i < codeLength; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", fmt.Errorf("%s:%w", op, err)
		}
		code += fmt.Sprintf("%d", num.Int64())
	}
	return code, nil
}

func SendEmailWithCod(to, code string) error {
	const op = "repository.helpers.SendEmailWithCode"

	from := "bisembaev.arman@gmail.com"
	password := "tyik qoai mktu llue"
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	message := "Subject: Your confirmation code\r\n\r\nConfrimation code: " + code

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
	if err != nil {
		return fmt.Errorf("%s:%w", op, err)
	}

	return nil
}
