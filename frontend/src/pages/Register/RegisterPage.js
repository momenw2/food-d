import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import classes from './registerPage.module.css';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

    export default function RegisterPage() {
        const auth = useAuth();
        const [params] = useSearchParams();
        const { user } = auth;
        const navigate = useNavigate();
        const returnUrl = params.get('returnUrl');

        useEffect(() => {
            if (!user) return;
            returnUrl ? navigate(returnUrl) : navigate('/');
        }, [user]);

        const {
            handleSubmit,
            register,
            getValues,
            formState: { errors },
        } = useForm();

        const submit = async data => {
            await auth.register(data);
        };
            return (
                <div className={classes.container}>
                <div className={classes.details}>
                    <Title title="Register" />
                    <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        type="text"
                        label="Name"
                        {...register('name', {
                        required: true,
                        minLength: 5,
                        })}
                        error={errors.name}
                    />

<Input
    type="date"
    label="BirthDate"
    {...register('birthdate', {
        required: true,
    })}
    error={errors.birthdate}
/>

<Input
    type="tel"
    label="Phone number"
    placeholder="+7 (xxx) xxx-xx-xx"
    {...register('phoneNumber', {
        required: true,
        pattern: {
            value: /^\+7\d{10}$/,
            message: 'Please enter a valid phone number: +7 (xxx) xxx-xx-xx',
        },
    })}
    error={errors.phoneNumber}
/>

<div>
    <label>Gender</label>
    <select {...register('gender', { required: true })} defaultValue="">
        <option value="" disabled hidden>
            Select Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
    {errors.gender && <span>This field is required</span>}
</div>
            
                    <Input
                        type="email"
                        label="Email"
                        {...register('email', {
                        required: true,
                        pattern: {
                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                            message: 'Email Is Not Valid',
                        },
                        })}
                        error={errors.email}
                    />
            
                    <Input
                        type="password"
                        label="Password"
                        {...register('password', {
                        required: true,
                        minLength: 5,
                        })}
                        error={errors.password}
                    />
            
                    <Input
                        type="password"
                        label="Confirm Password"
                        {...register('confirmPassword', {
                        required: true,
                        validate: value =>
                            value !== getValues('password')
                            ? 'Passwords Do No Match'
                            : true,
                        })}
                        error={errors.confirmPassword}
                    />
            
                    <Input
                        type="text"
                        label="Address"
                        {...register('address', {
                        required: true,
                        minLength: 10,
                        })}
                        error={errors.address}
                    />
            
                    <Button type="submit" text="Register" />
            
                    <div className={classes.login}>
                        Already a user? &nbsp;
                        <Link to={`/login${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
                        Login here
                        </Link>
                    </div>
                    </form>
                </div>
                </div>
            );
            }
