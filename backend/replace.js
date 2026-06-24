const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/controllers/AuthController.ts',
  'src/controllers/UploadController.ts',
  'src/controllers/UserController.ts',
  'src/services/AuthService.ts',
  'src/services/UploadService.ts',
  'src/services/UserService.ts',
  'src/middlewares/auth.middleware.ts'
];

const errorMessagesMap = {
  "'Unauthorized'": 'ErrorMessages.UNAUTHORIZED',
  "'Unauthorized access.'": 'ErrorMessages.UNAUTHORIZED_ACCESS',
  "'Authentication required. No token provided.'": 'ErrorMessages.AUTH_REQUIRED',
  "'Invalid or expired token.'": 'ErrorMessages.INVALID_TOKEN',
  "'No image provided.'": 'ErrorMessages.NO_IMAGE_PROVIDED',
  "'At least one photo is required.'": 'ErrorMessages.AT_LEAST_ONE_PHOTO',
  "'A memory with this title already exists in your vault. Consider adding to the same bulk or using a different title.'": 'ErrorMessages.DUPLICATE_TITLE_CREATE',
  "'Another memory with this title already exists in your vault. Please use a unique title.'": 'ErrorMessages.DUPLICATE_TITLE_UPDATE',
  "'Upload not found.'": 'ErrorMessages.UPLOAD_NOT_FOUND',
  "'Memory not found.'": 'ErrorMessages.MEMORY_NOT_FOUND_PERIOD',
  "'Memory not found'": 'ErrorMessages.MEMORY_NOT_FOUND',
  "'Memory not found or unauthorized'": 'ErrorMessages.MEMORY_NOT_FOUND_UNAUTHORIZED',
  "'This memory is private.'": 'ErrorMessages.MEMORY_PRIVATE',
  "'Access denied. A sharing token is required for this unlisted memory.'": 'ErrorMessages.ACCESS_DENIED_UNLISTED',
  "'Failed to remove memory.'": 'ErrorMessages.FAILED_TO_REMOVE_MEMORY',
  "'User not found.'": 'ErrorMessages.USER_NOT_FOUND',
  "'Invalid credentials.'": 'ErrorMessages.INVALID_CREDENTIALS',
  "'Email already in use.'": 'ErrorMessages.EMAIL_IN_USE',
  "'Username already taken.'": 'ErrorMessages.USERNAME_TAKEN',
  "'Invalid or expired OTP.'": 'ErrorMessages.INVALID_OTP',
  "'Failed to update user verification status.'": 'ErrorMessages.FAILED_VERIFICATION',
  "'Invalid email or password.'": 'ErrorMessages.INVALID_EMAIL_PASSWORD',
  "'Account not verified. Please check your email.'": 'ErrorMessages.ACCOUNT_NOT_VERIFIED',
  "'User with this email does not exist.'": 'ErrorMessages.USER_EMAIL_NOT_EXIST',
  "'Invalid old password.'": 'ErrorMessages.INVALID_OLD_PASSWORD',
  "'Failed to update profile.'": 'ErrorMessages.FAILED_TO_UPDATE_PROFILE',
  "'Failed to update avatar.'": 'ErrorMessages.FAILED_TO_UPDATE_AVATAR',
  "'Forbidden or not found'": 'ErrorMessages.FORBIDDEN_OR_NOT_FOUND',
  "'DUPLICATE_TITLE'": 'ErrorMessages.DUPLICATE_TITLE'
};

const constantMessagesMap = {
  "'Signup successful. Please check your email for verification OTP.'": 'ConstantMessages.SIGNUP_SUCCESS',
  "'OTP verified successfully.'": 'ConstantMessages.OTP_VERIFIED',
  "'Login successful.'": 'ConstantMessages.LOGIN_SUCCESS',
  "'Reset password OTP sent to your email.'": 'ConstantMessages.RESET_OTP_SENT',
  "'Password reset successful. You can now login.'": 'ConstantMessages.PASSWORD_RESET_SUCCESS',
  "'Password updated successfully.'": 'ConstantMessages.PASSWORD_UPDATED',
  "'Memories preserved successfully!'": 'ConstantMessages.MEMORIES_PRESERVED',
  "'Memory refined successfully!'": 'ConstantMessages.MEMORY_REFINED',
  "'Memory removed.'": 'ConstantMessages.MEMORY_REMOVED',
  "'Secure sharing enabled!'": 'ConstantMessages.SECURE_SHARING_ENABLED',
  "'Sharing disabled.'": 'ConstantMessages.SHARING_DISABLED'
};

const statusCodesMap = {
  'res.status(200)': 'res.status(StatusCodes.OK)',
  'res.status(201)': 'res.status(StatusCodes.CREATED)',
  'res.status(400)': 'res.status(StatusCodes.BAD_REQUEST)',
  'res.status(401)': 'res.status(StatusCodes.UNAUTHORIZED)',
  'res.status(403)': 'res.status(StatusCodes.FORBIDDEN)',
  'res.status(404)': 'res.status(StatusCodes.NOT_FOUND)',
  'res.status(500)': 'res.status(StatusCodes.INTERNAL_SERVER_ERROR)'
};

for (const filePath of filesToUpdate) {
  let content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  let originalContent = content;

  // Replace error messages
  for (const [key, value] of Object.entries(errorMessagesMap)) {
    content = content.split(key).join(value);
  }
  
  // Replace constant messages
  for (const [key, value] of Object.entries(constantMessagesMap)) {
    content = content.split(key).join(value);
  }

  // Replace status codes
  for (const [key, value] of Object.entries(statusCodesMap)) {
    content = content.split(key).join(value);
  }

  if (content !== originalContent) {
    let imports = '';
    
    // Add import for StatusCodes
    if (content.includes('StatusCodes.') && !content.includes('StatusCodes }')) {
      const depth = filePath.split('/').length - 2;
      const relativePath = '../'.repeat(depth) + 'enums/statusCodes.enum';
      imports += `import { StatusCodes } from '${relativePath}';\n`;
    }
    
    // Add import for ConstantMessages
    if (content.includes('ConstantMessages.') && !content.includes('ConstantMessages }')) {
      const depth = filePath.split('/').length - 2;
      const relativePath = '../'.repeat(depth) + 'enums/constantMessages.enum';
      imports += `import { ConstantMessages } from '${relativePath}';\n`;
    }
    
    // Add import for ErrorMessages
    if (content.includes('ErrorMessages.') && !content.includes('ErrorMessages }')) {
      const depth = filePath.split('/').length - 2;
      const relativePath = '../'.repeat(depth) + 'enums/errorMessages.enum';
      imports += `import { ErrorMessages } from '${relativePath}';\n`;
    }

    // Insert imports after the last import statement or at top
    if (imports) {
        const lines = content.split('\n');
        let lastImportIdx = -1;
        for (let i=0; i<lines.length; i++) {
            if (lines[i].startsWith('import ')) {
                lastImportIdx = i;
            }
        }
        if (lastImportIdx !== -1) {
            lines.splice(lastImportIdx + 1, 0, imports.trim());
        } else {
            lines.unshift(imports.trim());
        }
        content = lines.join('\n');
    }

    fs.writeFileSync(path.join(__dirname, filePath), content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}
