const bcrypt = require('bcryptjs');

const password = 'shad123';
console.log('Original password:', password);

bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    console.log('Generated salt:', salt);
    bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) throw err;
        console.log('Hashed password:', hashedPassword);

        // Compare the hashed password with the original password
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) throw err;
            console.log('Password match:', isMatch); // Should log true
        });
    });
});
