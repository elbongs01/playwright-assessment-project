import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('API Tests with Configuration', () => {
  test('should authenticate and be able to create', async ({ request }) => {
    
    // Add test metadata
    test.info().annotations.push({
      type: 'test-id',
      description: 'API001'
    });

    const baseURL = 'https://reqres.in/api';
    const apiKey = 'reqres-free-v1';
    
    let authToken;

    // 1. Authenticate and retrieve JWT token
    await test.step('Authenticate and retrieve a JWT token', async () => {
      const loginResponse = await request.post(`${baseURL}/login`, {
        data: {
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        },
                headers: {
          'Content-Type': 'application/json',
          // Add API key to headers if needed
          ...(apiKey && { 'X-API-Key': apiKey })
        }
      });

      expect(loginResponse.ok()).toBeTruthy();
      
      const loginBody = await loginResponse.json();
      expect(loginBody).toHaveProperty('token');
      authToken = loginBody.token;
      
      console.log('JWT Token retrieved:', authToken);
    });

    let taskId;

    // 2. Create a task
    await test.step('Create a task', async () => {
      const createResponse = await request.post(`${baseURL}/users`, {
        data: {
          name: 'Test Task',
          job: 'Automated Testing',
          completed: false
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          ...(apiKey && { 'X-API-Key': apiKey })
        }
      });

      expect(createResponse.ok()).toBeTruthy();
      const task = await createResponse.json();
      expect(task).toHaveProperty('id');
      
      taskId = task.id;
      console.log('Task created:', task);
    });

    // 3. Verify task exists
    await test.step('Verify task exists via GET request', async () => {
      const getResponse = await request.get(`${baseURL}/users/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          ...(apiKey && { 'X-API-Key': apiKey })
        }
      });

      expect(getResponse.ok()).toBeTruthy();
      const taskData = await getResponse.json();
      expect(taskData.data).toHaveProperty('id', parseInt(taskId));
      
      console.log('Verified Task:', taskData);
    });

    // 4. Update task
    await test.step('Update the tasks completed status', async () => {
      const updateResponse = await request.put(`${baseURL}/users/${taskId}`, {
        data: {
          name: 'Test Task',
          job: 'Automated Testing',
          completed: true
        },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          ...(apiKey && { 'X-API-Key': apiKey })
        }
      });

      expect(updateResponse.ok()).toBeTruthy();
      const updatedTask = await updateResponse.json();
      expect(updatedTask).toHaveProperty('updatedAt');
      
      console.log('Updated Task:', updatedTask);
    });
  });
});