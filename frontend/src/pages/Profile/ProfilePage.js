    import React from 'react';
    import { useForm } from 'react-hook-form';
    import { useAuth } from '../../hooks/useAuth';
    import classes from './profilePage.module.css';
    import Title from '../../components/Title/Title';
    import Input from '../../components/Input/Input';
    import Button from '../../components/Button/Button';
    import ChangePassword from '../../components/ChangePassword/ChangePassword';

    export default function ProfilePage() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const { user, updateProfile } = useAuth();

    const submit = user => {
        updateProfile(user);
    };

    const formatDate = (dateString) => {
        return dateString ? dateString.slice(0, 10) : ''; // Check if dateString is defined
    };

    return (
        <div className={classes.container}>
        <div className={classes.details}>
            <Title title="Update Profile" />
            <form onSubmit={handleSubmit(submit)}>
            <Input
                defaultValue={user.name}
                type="text"
                label="Name"
                {...register('name', {
                required: true,
                minLength: 5,
                })}
                error={errors.name}
            />
            <Input
                defaultValue={user.address}
                type="text"
                label="Address"
                {...register('address', {
                required: true,
                minLength: 10,
                })}
                error={errors.address}
            />
            <Input
                defaultValue={user.phoneNumber}
                type="tel"
                label="Phone number"
                {...register('phoneNumber', {
                required: true,
                pattern: {
                    value: /^\+7\d{10}$/,
                    message: 'Please enter a valid phone number: +7 (xxx) xxx-xx-xx',
                },
                })}
                error={errors.phoneNumber}
            />
            <Input
                        defaultValue={user.email}
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
                        defaultValue={formatDate(user.birthdate)}
                        type="text"
                        label="BirthDate"
                        disabled
            />

            <Input
                        defaultValue={user.gender}
                        type="text"
                        label="Gender"
                        disabled
            />


            <Button type="submit" text="Update" backgroundColor="#009e84" />
            </form>

            <ChangePassword />
        </div>
        </div>
    );
    }